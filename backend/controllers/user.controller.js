import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dns from "dns/promises";            // ← built-in Node.js, no install needed
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendOtpEmail,
  sendPasswordResetSuccessEmail,
} from "../utils/mailer.js";

// ── helpers ────────────────────────────────────────────────────────────────────
const isSkipVerification = () =>
  process.env.SKIP_EMAIL_VERIFICATION === "true";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Block disposable / temp email domains
const BLOCKED_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","tempmail.com","throwam.com",
  "yopmail.com","trashmail.com","fakeinbox.com","maildrop.cc",
  "dispostable.com","sharklasers.com","spam4.me","10minutemail.com",
  "temp-mail.org","getnada.com","mailnull.com","spamgourmet.com",
]);

// Obviously fake usernames on any provider
const FAKE_USERNAME = /^(test|fake|temp|demo|example|user|admin|info|null|undefined|asdf|qwerty|abcd|abcde|abcdef|1234|12345|abc|xyz|aaa|bbb|ccc|ddd|eee|fff|ggg|hhh|zzz|noreply|no-reply|donotreply)$/i;

// ── Step 1: fast sync checks (format, blocked domains, fake usernames) ─────────
const quickValidateEmail = (email) => {
  if (!emailRegex.test(email))
    return "Enter a valid email address (e.g. name@domain.com).";

  const [local, domain] = email.split("@");
  const domainLower = domain.toLowerCase();

  if (BLOCKED_DOMAINS.has(domainLower))
    return "Disposable email addresses are not allowed. Please use a real email.";

  if (local.length < 3)
    return "Email username must be at least 3 characters.";

  // All same character (aaaa, bbbb, cccc...)
  const uniqueChars = new Set(local.replace(/[^a-z]/gi, "").toLowerCase()).size;
  if (local.length >= 4 && uniqueChars <= 1)
    return "Please enter a real email address.";

  // Known fake username patterns
  if (FAKE_USERNAME.test(local))
    return "Please enter your real email address.";

  // Domain must have at least 2-char TLD
  const parts = domainLower.split(".");
  if (parts.length < 2 || parts[parts.length - 1].length < 2)
    return "Enter a valid email address (e.g. name@domain.com).";

  return null;
};

// ── Step 2: async DNS MX check — verifies domain can receive email ──────────────
const checkEmailDomainExists = async (email) => {
  try {
    const domain = email.split("@")[1].toLowerCase();
    const records = await dns.resolveMx(domain);
    // Must have at least one MX record with a real exchange
    return records && records.length > 0 && records[0].exchange;
  } catch {
    // DNS lookup failed = domain doesn't exist or has no mail server
    return false;
  }
};

// ── Fire-and-forget email helper ───────────────────────────────────────────────
const fireEmail = (fn, ...args) => {
  fn(...args).catch((err) =>
    console.error(`❌ Email failed [${fn.name}]:`, err.message)
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER
// POST /api/v1/user/register
// ══════════════════════════════════════════════════════════════════════════════
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required.", success: false });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters.", success: false });
    }

    // Step 1 — fast pattern checks (no network)
    const quickErr = quickValidateEmail(email);
    if (quickErr) return res.status(400).json({ message: quickErr, success: false });

    // Step 2 — DNS MX check: does this domain actually accept email?
    const domainExists = await checkEmailDomainExists(email);
    if (!domainExists) {
      return res.status(400).json({
        message: "This email domain does not exist or cannot receive emails. Please use a valid email address.",
        success: false,
      });
    }

    const existing = await User.findOne({ email });

    // ── CASE 1: Already registered but NOT verified ────────────────────────────
    // Instead of rejecting, auto-resend the verification email and tell
    // the frontend to show the "check your inbox" screen.
    if (existing && !existing.isEmailVerified) {
      const token  = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

      existing.emailVerificationToken  = token;
      existing.emailVerificationExpiry = expiry;
      await existing.save();

      console.log(`📧 Re-sending verification to existing unverified user: ${email}`);
      if (!isSkipVerification()) {
        fireEmail(sendVerificationEmail, email, existing.fullname, token, expiry);
      }

      // Return 200 (not 409) so the frontend treats it as success
      // and shows the "check your email" screen
      return res.status(200).json({
        success:   true,
        resent:    true,            // ← frontend can detect this
        email,
        message:   "Verification email resent! Check your inbox.",
      });
    }

    // ── CASE 2: Already registered AND verified ────────────────────────────────
    if (existing && existing.isEmailVerified) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
        success: false,
      });
    }

    // ── CASE 3: New user ───────────────────────────────────────────────────────
    let profilePhotoUrl = "";
    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloud   = await cloudinary.uploader.upload(fileUri.content);
        profilePhotoUrl = cloud.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload failed:", cloudErr.message);
        // Non-fatal — continue without photo
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token          = crypto.randomBytes(32).toString("hex");
    const expiry         = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 24 h

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password:               hashedPassword,
      role,
      profile:                { profilePhoto: profilePhotoUrl },
      emailVerificationToken:  token,
      emailVerificationExpiry: expiry,
      isEmailVerified:         isSkipVerification(), // auto-verify in dev
    });

    console.log(`✅ New user registered: ${email} | verified=${newUser.isEmailVerified}`);

    // Always send verification email
    fireEmail(sendVerificationEmail, email, fullname, token, expiry, password);

    return res.status(201).json({
      success: true,
      email,
      message: newUser.isEmailVerified
        ? "Account created! A confirmation email has been sent to your inbox."
        : "Account created! Please check your email to verify your account.",
      user: {
        _id:             newUser._id,
        fullname:        newUser.fullname,
        email:           newUser.email,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// GOOGLE AUTH
// POST /api/v1/user/google
// ══════════════════════════════════════════════════════════════════════════════
export const googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required.", success: false });
    }

    const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;
    if (!FIREBASE_WEB_API_KEY) {
      return res.status(503).json({ message: "Google auth not configured on server.", success: false });
    }

    let decodedToken;
    try {
      const verifyRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credential }),
        }
      );
      const verifyData = await verifyRes.json();
      console.log("Google identity lookup response:", JSON.stringify(verifyData));
      if (!verifyRes.ok) {
        return res.status(400).json({ message: `Google verification failed: ${verifyData?.error?.message || verifyData.error || 'Unknown error'}`, success: false, error: verifyData });
      }
      if (!verifyData.users || !verifyData.users[0]) {
        return res.status(401).json({ message: "Invalid Google credential.", success: false });
      }
      const userData = verifyData.users[0];
      decodedToken = {
        uid: userData.localId,
        email: userData.email,
        name: userData.displayName || userData.email.split("@")[0],
        picture: userData.photoUrl,
      };
    } catch (verifyErr) {
      console.error("Google token verification failed:", verifyErr.message);
      return res.status(401).json({ message: "Invalid Google credential.", success: false });
    }

    const { uid, email, name, picture } = decodedToken;
    if (!email) {
      return res.status(400).json({ message: "Google account must have an email.", success: false });
    }

    let user = await User.findOne({ googleId: uid });

    if (!user) {
      user = await User.findOne({ email });
      if (user && user.authProvider === "local") {
        return res.status(400).json({
          message: "This email is already registered. Please login with email/password.",
          success: false,
        });
      }
      if (user && user.authProvider === "google") {
        user.googleId = uid;
        await user.save();
          } else {
        user = await User.create({
          fullname: name || email.split("@")[0],
          email,
          googleId: uid,
          authProvider: "google",
          isEmailVerified: true,
          role: role || "student",
          profile: { profilePhoto: picture || "" },
        });
        
        try {
          await sendWelcomeEmail(user.email, user.fullname);
          console.log(`📧 Welcome email sent to ${user.email}`);
        } catch (emailErr) {
          console.error("Welcome email failed:", emailErr.message);
        }
      }
    }

    // Send welcome email for returning Google users
    try {
      await sendWelcomeEmail(user.email, user.fullname);
      console.log(`📧 Welcome email sent to ${user.email}`);
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr.message);
    }

    if (role && user.role !== role) {
      console.log(`Role mismatch: request role=${role}, user role=${user.role}`);
      return res.status(400).json({
        message: `This account is registered as ${user.role}.`,
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: `Welcome back, ${user.fullname}!`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
        },
      });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// POST /api/v1/user/login
// ══════════════════════════════════════════════════════════════════════════════
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required.", success: false });
    }

    const emailErr = quickValidateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr, success: false });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered. Please sign up first.", success: false });
    }

    // ── Block unverified users — but tell frontend so it can show resend ───────
    // Skip for admin users
    const skipVerification = isSkipVerification() || user.role === "admin";
    if (!user.isEmailVerified && !skipVerification) {
      return res.status(403).json({
        success:     false,
        notVerified: true,          // ← frontend detects this
        email:       user.email,
        message:     "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password.", success: false });
    }

    if (role !== user.role) {
      return res.status(400).json({ message: "Incorrect role for this account.", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge:   5 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure:   process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: `Welcome back, ${user.fullname}!`,
        user: {
          _id:             user._id,
          fullname:        user.fullname,
          email:           user.email,
          phoneNumber:     user.phoneNumber,
          role:            user.role,
          profile:         user.profile,
          isEmailVerified: user.isEmailVerified,
        },
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// VERIFY EMAIL
// GET /api/v1/user/verify-email?token=...&email=...
// ══════════════════════════════════════════════════════════════════════════════
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ message: "Invalid verification link.", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success:     true,
        alreadyDone: true,
        message:     "Email already verified. You can log in.",
      });
    }

    const tokenExpired = !user.emailVerificationExpiry ||
                         new Date() > user.emailVerificationExpiry;
    const tokenMismatch = user.emailVerificationToken !== token;

    if (tokenMismatch || tokenExpired) {
      return res.status(400).json({
        success: false,
        expired: true,
        message: tokenExpired
          ? "Verification link has expired. Please request a new one."
          : "Invalid verification link.",
      });
    }

    user.isEmailVerified         = true;
    user.emailVerificationToken  = null;
    user.emailVerificationExpiry = null;
    await user.save();

    console.log(`✅ Email verified: ${email}`);
    fireEmail(sendWelcomeEmail, email, user.fullname);

    return res.status(200).json({
      success: true,
      message: "Email verified! You can now log in.",
      user: {
        _id:             user._id,
        fullname:        user.fullname,
        email:           user.email,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// RESEND VERIFICATION EMAIL
// POST /api/v1/user/resend-verification-email
// body: { email }
// ══════════════════════════════════════════════════════════════════════════════
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required.", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a new verification link has been sent.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "This email is already verified. Please log in.",
      });
    }

    // Rate limit: don't resend if last token is less than 2 minutes old
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    if (
      user.emailVerificationExpiry &&
      user.emailVerificationExpiry > new Date(Date.now() + 22 * 60 * 60 * 1000)
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait a moment before requesting another email.",
      });
    }

    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    user.emailVerificationToken  = token;
    user.emailVerificationExpiry = expiry;
    await user.save();

    if (!isSkipVerification()) {
      console.log(`📧 Resending verification to: ${email}`);
      await sendVerificationEmail(email, user.fullname, token, expiry);
      return res.status(200).json({
        success: true,
        email: user.email,
        message: "Verification email resent! Check your inbox (and spam).",
      });
    }

    return res.status(200).json({ success: true, email: user.email, message: "Verification is disabled." });
  } catch (error) {
    console.error("Resend Verification Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// POST /api/v1/user/forgot-password
// ══════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD — sends 6-digit OTP to email
// POST /api/v1/user/forgot-password
// body: { email }
// ══════════════════════════════════════════════════════════════════════════════
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required.", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Use native driver to read raw fields
    const user = await User.collection.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, an OTP has been sent.",
      });
    }

    // ── COOLDOWN: block if OTP was sent less than 2 minutes ago ──────────────
    // This prevents a second request from overwriting the first OTP in DB
    // which would cause "mismatch" errors when user enters the first OTP
    if (user.resetOtpExpires) {
      const sentAt      = new Date(user.resetOtpExpires).getTime() - 10 * 60 * 1000;
      const secondsAgo  = Math.floor((Date.now() - sentAt) / 1000);
      const cooldownSec = 120; // 2 minutes

      if (secondsAgo < cooldownSec) {
        const waitSec = cooldownSec - secondsAgo;
        console.log(`⏳ OTP cooldown for ${normalizedEmail} — wait ${waitSec}s`);
        return res.status(429).json({
          success:  false,
          cooldown: true,
          waitSec,
          message:  `OTP already sent. Please wait ${waitSec} seconds before requesting a new one. Check your inbox (and spam folder) for the existing OTP.`,
        });
      }
    }

    // Generate 6-digit OTP
    const otp     = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Native MongoDB driver — bypasses Mongoose strict mode completely
    await User.collection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          resetOtp:         otp,
          resetOtpExpires:  expires,
          resetOtpVerified: false,
        },
      }
    );

    // Confirm saved
    const check = await User.collection.findOne({ email: normalizedEmail });
    console.log(`✅ OTP saved for ${normalizedEmail}: "${check.resetOtp}" | expires: ${check.resetOtpExpires}`);

    if (!check.resetOtp) {
      return res.status(500).json({ message: "Failed to save OTP. Please try again.", success: false });
    }

    fireEmail(sendOtpEmail, normalizedEmail, user.fullname, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. It expires in 10 minutes.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// VERIFY OTP
// POST /api/v1/user/verify-otp
// body: { email, otp }
// ══════════════════════════════════════════════════════════════════════════════
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required.", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpStr          = otp.toString().trim();

    console.log(`🔍 verify-otp | email: ${normalizedEmail} | received: "${otpStr}"`);

    // Use native driver — completely bypasses Mongoose schema / strict mode
    const rawUser = await User.collection.findOne({ email: normalizedEmail });
    if (!rawUser) {
      return res.status(404).json({ message: "No account found with this email.", success: false });
    }

    console.log(`   DB resetOtp:        "${rawUser.resetOtp}"`);
    console.log(`   DB resetOtpExpires: ${rawUser.resetOtpExpires}`);
    console.log(`   Now:                ${new Date()}`);

    // No OTP in DB
    if (!rawUser.resetOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please click 'Forgot Password' to request a new OTP.",
      });
    }

    // OTP expired
    if (!rawUser.resetOtpExpires || new Date() > new Date(rawUser.resetOtpExpires)) {
      await User.collection.updateOne(
        { email: normalizedEmail },
        { $set: { resetOtp: null, resetOtpExpires: null, resetOtpVerified: false } }
      );
      return res.status(400).json({
        success: false,
        expired: true,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // OTP mismatch
    if (rawUser.resetOtp.toString().trim() !== otpStr) {
      console.log(`   ❌ Mismatch — stored:"${rawUser.resetOtp}" | received:"${otpStr}"`);
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // ✅ Mark verified
    await User.collection.updateOne(
      { email: normalizedEmail },
      { $set: { resetOtpVerified: true } }
    );
    console.log(`   ✅ OTP verified for ${normalizedEmail}`);

    return res.status(200).json({
      success: true,
      message: "OTP verified! You can now set a new password.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// RESET PASSWORD  (only after OTP verified)
// POST /api/v1/user/reset-password
// body: { email, password }
// ══════════════════════════════════════════════════════════════════════════════
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password are required.", success: false });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters.", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Use native driver to read — bypasses Mongoose schema strict mode
    const rawUser = await User.collection.findOne({ email: normalizedEmail });
    if (!rawUser) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Must have verified OTP first
    if (!rawUser.resetOtpVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your OTP before resetting password.",
      });
    }

    // OTP session must not be expired
    if (!rawUser.resetOtpExpires || new Date() > new Date(rawUser.resetOtpExpires)) {
      return res.status(400).json({
        success: false,
        expired: true,
        message: "OTP session expired. Please start over.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use native driver to write — bypasses Mongoose schema strict mode
    await User.collection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          password:         hashedPassword,
          resetOtp:         null,
          resetOtpExpires:  null,
          resetOtpVerified: false,
        },
      }
    );

    console.log(`✅ Password reset for: ${normalizedEmail}`);
    fireEmail(sendPasswordResetSuccessEmail, normalizedEmail, rawUser.fullname);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════════════════════
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge:   0,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure:   process.env.NODE_ENV === "production",
      })
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// VERIFY USER (Check if user is still valid)
// ══════════════════════════════════════════════════════════════════════════════
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(401).json({ 
        message: "User not found or deleted", 
        success: false 
      });
    }
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Verify User Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// GET ALL USERS  (Admin)
// ══════════════════════════════════════════════════════════════════════════════
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users, success: true });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// GET USER BY ID  (Admin)
// ══════════════════════════════════════════════════════════════════════════════
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found.", success: false });
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// DELETE USER  (Admin)
// ══════════════════════════════════════════════════════════════════════════════
export const deleteUser = async (req, res) => {
  try {
    const adminUser = await User.findById(req.id);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users.", success: false });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found.", success: false });

    if (user._id.toString() === req.id) {
      return res.status(400).json({ message: "You cannot delete your own account.", success: false });
    }

    if (user.profile?.profilePhoto) {
      try {
        const publicId = user.profile.profilePhoto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr.message);
      }
    }

    try {
      await Application.deleteMany({ applicant: user._id });
    } catch (appErr) {
      console.error("Application delete error:", appErr.message);
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// TOGGLE USER STATUS  (Admin)
// ══════════════════════════════════════════════════════════════════════════════
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found.", success: false });

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
      user,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// UPDATE PROFILE
// ══════════════════════════════════════════════════════════════════════════════
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, role } = req.body;
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ message: "User not found.", success: false });

    console.log("Update profile - user role:", user.role, "req.id:", req.id);
    console.log("Update profile - body:", req.body);

    if (fullname)    user.fullname       = fullname;
    if (email)       user.email          = email;
    if (phoneNumber) user.phoneNumber    = phoneNumber;
    if (bio)         user.profile.bio    = bio;
    if (skills)      user.profile.skills = typeof skills === 'string' ? skills.split(",").map((s) => s.trim()) : skills;

    const photoFile = req.files?.file?.[0];
    if (photoFile) {
      if (user.profile?.profilePhoto) {
        try {
          const oldId = user.profile.profilePhoto.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(oldId);
        } catch (cloudErr) {
          console.error("Cloudinary photo delete error:", cloudErr.message);
        }
      }
      const fileUri = getDataUri(photoFile);
      const cloud   = await cloudinary.uploader.upload(fileUri.content, { folder: "profile_photos" });
      user.profile.profilePhoto = cloud.secure_url;
    }

    const resumeFile = req.files?.resume?.[0];
    if (resumeFile) {
      const fileUri = getDataUri(resumeFile);
      const cloud   = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw", folder: "resumes",
      });
      user.profile.resume             = cloud.secure_url;
      user.profile.resumeOriginalName = resumeFile.originalname;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        _id:         user._id,
        fullname:    user.fullname,
        email:       user.email,
        phoneNumber: user.phoneNumber,
        role:        user.role,
        profile:     user.profile,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error.", success: false });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// TEST EMAIL  (for debugging)
// POST /api/v1/user/test-email
// ══════════════════════════════════════════════════════════════════════════════
export const testEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required.", success: false });
    }

    const { sendEmail } = await import("../utils/mailer.js");
    
    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7c3aed;">🧪 GrowX Email Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your email system is configured correctly! ✅</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "🧪 GrowX Email Configuration Test",
      html: testHtml,
    });

    return res.status(200).json({
      success: true,
      message: `Test email sent to ${email}. Check your inbox!`,
    });
  } catch (error) {
    console.error("Test Email Error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to send test email. Check your MAIL_USER and MAIL_PASS configuration.",
      error: error.message 
    });
  }
};