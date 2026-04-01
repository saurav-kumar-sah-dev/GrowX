import nodemailer from "nodemailer";

// ── Transporter ────────────────────────────────────────────────────────────────
const createTransporter = () => {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS?.replace(/\s/g, ''); // Remove spaces
  const mailHost = process.env.MAIL_HOST || "smtp.gmail.com";
  const mailPort = parseInt(process.env.MAIL_PORT || "587", 10);
  const isSecure = mailPort === 465;
  const allowSelfSigned =
    process.env.MAIL_ALLOW_SELF_SIGNED === "true" ||
    process.env.NODE_ENV !== "production";
  
  if (!mailUser || !mailPass) {
    console.warn("⚠️ MAIL_USER or MAIL_PASS not configured");
    return null;
  }
  
  return nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: isSecure,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
    tls: allowSelfSigned ? { rejectUnauthorized: false } : undefined,
  });
};

// ── Verify on startup ──────────────────────────────────────────────────────────
export const verifyMailer = async () => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn("⚠️ Mailer: MAIL_USER or MAIL_PASS not set - emails disabled");
    return;
  }
  try {
    const t = createTransporter();
    if (!t) return;
    const ms = parseInt(process.env.MAIL_VERIFY_TIMEOUT_MS || "12000", 10);
    await Promise.race([
      t.verify(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection timeout")),
          Math.max(3000, ms)
        )
      ),
    ]);
    console.log(`✅ Mailer ready — sending as ${process.env.MAIL_USER}`);
  } catch (err) {
    console.warn("⚠️ Mailer connection failed:", err.message);
    console.warn("   → Emails will be logged but not sent");
    console.warn("   → Check MAIL_USER and MAIL_PASS in .env");
  }
};

// ── Generic send with retry ────────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, html }, retries = 2) => {
  const transporter = createTransporter();
  if (!transporter) throw new Error("Mail transporter not configured.");
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"GrowX" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent to ${to} | id: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`❌ Email attempt ${attempt} failed:`, err.message);
      if (attempt > retries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1.  VERIFICATION EMAIL  — simple design, name + email + password only
// ═══════════════════════════════════════════════════════════════════════════════
export const sendVerificationEmail = async (email, fullname, token, expiry, plainPassword = "") => {
  const FRONTEND = process.env.FRONTEND_URL || "https://growx.onrender.com";
  const link     = `${FRONTEND}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  // Generate QR code image URL using QuickChart (free, no install needed)
  // QR encodes the verify link so user can scan with phone
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(link)}&size=160&margin=2`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;
             font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:10px;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);
                  padding:28px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
          Welcome to GrowX !
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:32px;">

        <p style="font-size:16px;font-weight:700;margin:0 0 10px;">
          Hey ${fullname},
        </p>

        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Thank you for registering at GrowX! We're excited to have you as
          part of our community.
        </p>

        <!-- Registration Details -->
        <p style="font-size:15px;font-weight:700;margin:0 0 12px;color:#111827;">
          Your Registration Details:
        </p>
        <ul style="margin:0 0 24px;padding:0 0 0 18px;
                   color:#374151;font-size:14px;line-height:2.2;">
          <li><strong>Name:</strong> &nbsp;${fullname}</li>
          <li><strong>Email:</strong> &nbsp;${email}</li>
          <li><strong>Password:</strong> &nbsp;${plainPassword || "As you entered during signup"}</li>
        </ul>

        <!-- QR Code -->
        <p style="font-size:15px;font-weight:700;margin:0 0 10px;color:#111827;">
          QR Code For Entry
        </p>
        <p style="color:#6b7280;font-size:13px;margin:0 0 14px;">
          Scan this QR code with your phone to verify your email instantly:
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <img src="${qrUrl}"
               alt="Verify Email QR Code"
               width="160" height="160"
               style="border:3px solid #e5e7eb;border-radius:10px;
                      display:block;margin:0 auto;"/>
        </div>

        <p style="color:#dc2626;font-size:13px;margin:0 0 12px;">
          Click the link to activate your account. Expires in 5 days.
        </p>

        <ol style="color:#4b5563;font-size:13px;margin:0 0 24px;padding:0 0 0 18px;line-height:1.8;">
          <li>Open your email app</li>
          <li>Find the email from GrowX</li>
          <li>Click "Verify My Email"</li>
          <li>Come back and sign in!</li>
        </ol>

        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px;">
          If you have any questions, feel free to contact us at
          <a href="mailto:${process.env.MAIL_USER}"
             style="color:#7c3aed;">${process.env.MAIL_USER}</a>.
        </p>

        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 28px;">
          Welcome aboard, and we look forward to seeing you soon!
        </p>

        <hr style="border:none;border-top:1px solid #f0f0f0;margin-bottom:18px;"/>

        <p style="color:#6b7280;font-size:13px;margin:0;">
          Thanks and Regards,<br/>
          <strong>The GrowX Team</strong>
        </p>

      </div>
    </div>

    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      © ${new Date().getFullYear()} GrowX &nbsp;·&nbsp; Your Career Growth Platform
    </p>
  </div>

</body>
</html>`;

  await sendEmail({ to: email, subject: "Welcome to GrowX — Verify Your Email", html });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2.  WELCOME EMAIL  (after verification)
// ═══════════════════════════════════════════════════════════════════════════════
export const sendWelcomeEmail = async (email, fullname) => {
  const FRONTEND = process.env.FRONTEND_URL || "https://growx.onrender.com";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f2f5;
             font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:10px;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">

      <div style="background:linear-gradient(135deg,#10b981,#059669);
                  padding:28px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
          🎉 Email Verified!
        </h2>
      </div>

      <div style="padding:32px;">
        <p style="font-size:16px;font-weight:700;margin:0 0 10px;">
          Hey ${fullname},
        </p>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px;">
          Your email has been verified successfully. Your GrowX account is
          now fully active — start exploring!
        </p>
        <ul style="margin:0 0 24px;padding:0 0 0 18px;
                   color:#374151;font-size:14px;line-height:2.0;">
          <li>🧠 Take quizzes &amp; track progress</li>
          <li>💼 Browse jobs &amp; internships</li>
          <li>📄 Build your resume with AI</li>
          <li>✅ ATS checker for your resume</li>
        </ul>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${FRONTEND}/login"
             style="display:inline-block;
                    background:linear-gradient(135deg,#10b981,#059669);
                    color:#ffffff;text-decoration:none;
                    padding:12px 40px;border-radius:8px;
                    font-size:15px;font-weight:700;">
            🚀 &nbsp;Go to Dashboard
          </a>
        </div>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px;">
          If you have any questions, contact us at
          <a href="mailto:${process.env.MAIL_USER}"
             style="color:#7c3aed;">${process.env.MAIL_USER}</a>.
        </p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 28px;">
          Welcome aboard, and we look forward to seeing you grow!
        </p>
        <hr style="border:none;border-top:1px solid #f0f0f0;margin-bottom:18px;"/>
        <p style="color:#6b7280;font-size:13px;margin:0;">
          Thanks and Regards,<br/>
          <strong>The GrowX Team</strong>
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      © ${new Date().getFullYear()} GrowX &nbsp;·&nbsp; Your Career Growth Platform
    </p>
  </div>
</body>
</html>`;

  await sendEmail({ to: email, subject: "🎉 Welcome to GrowX — You're all set!", html });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3.  FORGOT PASSWORD EMAIL
// ═══════════════════════════════════════════════════════════════════════════════
export const sendForgotPasswordEmail = async (email, fullname, token) => {
  const FRONTEND = process.env.FRONTEND_URL || "https://growx.onrender.com";
  const link     = `${FRONTEND}/reset-password/${token}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f2f5;
             font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:10px;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">

      <div style="background:linear-gradient(135deg,#7c3aed,#dc2626);
                  padding:28px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
          🔑 Password Reset Request
        </h2>
      </div>

      <div style="padding:32px;">
        <p style="font-size:16px;font-weight:700;margin:0 0 10px;">
          Hey ${fullname},
        </p>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px;">
          We received a request to reset the password for your GrowX account.
        </p>
        <ul style="margin:0 0 24px;padding:0 0 0 18px;
                   color:#374151;font-size:14px;line-height:2.0;">
          <li><strong>Name:</strong> &nbsp;${fullname}</li>
          <li><strong>Email:</strong> &nbsp;${email}</li>
        </ul>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${link}"
             style="display:inline-block;
                    background:linear-gradient(135deg,#7c3aed,#dc2626);
                    color:#ffffff;text-decoration:none;
                    padding:12px 40px;border-radius:8px;
                    font-size:15px;font-weight:700;">
            🔑 &nbsp;Reset My Password
          </a>
        </div>
        <p style="color:#dc2626;font-size:13px;line-height:1.6;margin:0 0 24px;">
          If you did <strong>not</strong> request this, please ignore this
          email. Your account is safe.
        </p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 6px;">
          Questions? Contact us at
          <a href="mailto:${process.env.MAIL_USER}"
             style="color:#7c3aed;">${process.env.MAIL_USER}</a>.
        </p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 28px;">
          Welcome aboard, and we look forward to seeing you soon!
        </p>
        <hr style="border:none;border-top:1px solid #f0f0f0;margin-bottom:18px;"/>
        <p style="color:#6b7280;font-size:13px;margin:0;">
          Thanks and Regards,<br/>
          <strong>The GrowX Team</strong>
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      © ${new Date().getFullYear()} GrowX &nbsp;·&nbsp; Your Career Growth Platform
    </p>
  </div>
</body>
</html>`;

  await sendEmail({ to: email, subject: "🔑 Reset Your GrowX Password", html });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4.  PASSWORD RESET SUCCESS
// ═══════════════════════════════════════════════════════════════════════════════
export const sendPasswordResetSuccessEmail = async (email, fullname) => {
  const FRONTEND = process.env.FRONTEND_URL || "https://growx.onrender.com";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f2f5;
             font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:10px;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">

      <div style="background:linear-gradient(135deg,#10b981,#059669);
                  padding:28px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
          ✅ Password Reset Successful
        </h2>
      </div>

      <div style="padding:32px;">
        <p style="font-size:16px;font-weight:700;margin:0 0 10px;">
          Hey ${fullname},
        </p>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px;">
          Your GrowX account password has been reset successfully.
          You can now log in with your new password.
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${FRONTEND}/login"
             style="display:inline-block;
                    background:linear-gradient(135deg,#10b981,#059669);
                    color:#ffffff;text-decoration:none;
                    padding:12px 40px;border-radius:8px;
                    font-size:15px;font-weight:700;">
            Go to Login
          </a>
        </div>
        <p style="color:#dc2626;font-size:13px;margin:0 0 24px;">
          If you did <strong>not</strong> make this change, contact us at
          <a href="mailto:${process.env.MAIL_USER}"
             style="color:#dc2626;">${process.env.MAIL_USER}</a> immediately.
        </p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 28px;">
          Welcome aboard, and we look forward to seeing you soon!
        </p>
        <hr style="border:none;border-top:1px solid #f0f0f0;margin-bottom:18px;"/>
        <p style="color:#6b7280;font-size:13px;margin:0;">
          Thanks and Regards,<br/>
          <strong>The GrowX Team</strong>
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      © ${new Date().getFullYear()} GrowX &nbsp;·&nbsp; Your Career Growth Platform
    </p>
  </div>
</body>
</html>`;

  await sendEmail({ to: email, subject: "✅ GrowX Password Reset Successful", html });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5.  OTP EMAIL  — for password reset
// ═══════════════════════════════════════════════════════════════════════════════
export const sendOtpEmail = async (email, fullname, otp) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f2f5;
             font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:10px;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);
                  padding:28px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
          🔑 Password Reset OTP
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:32px;">

        <p style="font-size:16px;font-weight:700;margin:0 0 10px;">
          Hey ${fullname},
        </p>

        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 24px;">
          We received a request to reset your GrowX account password.
          Use the OTP below to verify your identity.
        </p>

        <!-- OTP Box -->
        <div style="background:#f5f3ff;border:2px dashed #7c3aed;
                    border-radius:10px;padding:24px;
                    text-align:center;margin:0 0 24px;">
          <p style="color:#6b7280;font-size:13px;margin:0 0 10px;">
            Your One-Time Password (OTP)
          </p>
          <p style="font-size:42px;font-weight:800;letter-spacing:10px;
                    color:#7c3aed;margin:0;">
            ${otp}
          </p>
          <p style="color:#dc2626;font-size:12px;margin:12px 0 0;">
            ⏰ Expires in <strong>10 minutes</strong>
          </p>
        </div>

        <!-- Details -->
        <p style="font-size:15px;font-weight:700;margin:0 0 12px;color:#111827;">
          Your Details:
        </p>
        <ul style="margin:0 0 24px;padding:0 0 0 18px;
                   color:#374151;font-size:14px;line-height:2.0;">
          <li><strong>Name:</strong> &nbsp;${fullname}</li>
          <li><strong>Email:</strong> &nbsp;${email}</li>
        </ul>

        <p style="color:#dc2626;font-size:13px;line-height:1.6;margin:0 0 20px;">
          🛡️ If you did <strong>not</strong> request this, please ignore
          this email. Your account is safe.
        </p>

        <p style="color:#4b5563;font-size:14px;margin:0 0 6px;">
          If you have any questions, contact us at
          <a href="mailto:${process.env.MAIL_USER}"
             style="color:#7c3aed;">${process.env.MAIL_USER}</a>.
        </p>

        <p style="color:#4b5563;font-size:14px;margin:0 0 28px;">
          Welcome aboard, and we look forward to seeing you soon!
        </p>

        <hr style="border:none;border-top:1px solid #f0f0f0;margin-bottom:18px;"/>

        <p style="color:#6b7280;font-size:13px;margin:0;">
          Thanks and Regards,<br/>
          <strong>The GrowX Team</strong>
        </p>

      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      © ${new Date().getFullYear()} GrowX &nbsp;·&nbsp; Your Career Growth Platform
    </p>
  </div>
</body>
</html>`;

  await sendEmail({ to: email, subject: "🔑 Your GrowX Password Reset OTP", html });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6.  CONTACT FORM NOTIFICATION  — sent to admin when user submits contact form
// ═══════════════════════════════════════════════════════════════════════════════
export const sendContactNotificationEmail = async (name, email, message) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("❌ ADMIN_EMAIL not set in .env");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f2f5;
             font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:10px;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">

      <div style="background:linear-gradient(135deg,#D4A853,#C8884A);
                  padding:28px;text-align:center;">
        <h2 style="color:#0A0A0F;margin:0;font-size:22px;font-weight:700;">
          📬 New Contact Form Submission
        </h2>
      </div>

      <div style="padding:32px;">
        <p style="font-size:15px;font-weight:700;margin:0 0 8px;color:#111827;">
          You received a new message from:
        </p>

        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 20px;">
          <p style="margin:0 0 8px;font-size:14px;">
            <strong style="color:#D4A853;">Name:</strong> &nbsp;${name}
          </p>
          <p style="margin:0 0 8px;font-size:14px;">
            <strong style="color:#D4A853;">Email:</strong> &nbsp;<a href="mailto:${email}" style="color:#7c3aed;">${email}</a>
          </p>
          <p style="margin:0;font-size:14px;">
            <strong style="color:#D4A853;">Date:</strong> &nbsp;${new Date().toLocaleString()}
          </p>
        </div>

        <p style="font-size:15px;font-weight:700;margin:0 0 10px;color:#111827;">
          Message:
        </p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 24px;">
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="mailto:${email}?subject=Re: GrowX Contact Form Submission"
             style="display:inline-block;
                    background:linear-gradient(135deg,#D4A853,#C8884A);
                    color:#0A0A0F;text-decoration:none;
                    padding:12px 32px;border-radius:8px;
                    font-size:14px;font-weight:700;">
            Reply to ${name}
          </a>
        </div>

        <hr style="border:none;border-top:1px solid #f0f0f0;margin-bottom:18px;"/>
        <p style="color:#6b7280;font-size:13px;margin:0;">
          <strong>GrowX</strong> — Career Growth Platform
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      © ${new Date().getFullYear()} GrowX &nbsp;·&nbsp; Your Career Growth Platform
    </p>
  </div>
</body>
</html>`;

  await sendEmail({ to: adminEmail, subject: `📬 New Contact: ${name} <${email}>`, html });
};