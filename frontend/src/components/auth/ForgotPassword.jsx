import React, { useState, useRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Mail, Lock, Eye, EyeOff,
  Loader2, ArrowLeft, ArrowRight,
  Sparkles, CheckCircle2,
} from 'lucide-react';
import { API } from '@/config/api';

// Password strength
const getStrength = (p) => {
  if (!p) return { score: 0, label: '', color: '' };
  let s = 0;
  if (p.length >= 8)           s++;
  if (p.length >= 12)          s++;
  if (/[A-Z]/.test(p))         s++;
  if (/[0-9]/.test(p))         s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const levels = [
    { label: 'Very weak',   color: 'bg-red-500'     },
    { label: 'Weak',        color: 'bg-orange-500'  },
    { label: 'Fair',        color: 'bg-yellow-400'  },
    { label: 'Good',        color: 'bg-blue-500'    },
    { label: 'Strong',      color: 'bg-green-500'   },
    { label: 'Very strong', color: 'bg-emerald-500' },
  ];
  return { score: s, ...levels[s] };
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  // step: 1 = enter email, 2 = enter OTP, 3 = new password, 4 = success
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [email, setEmail] = useState('');

  // Step 2 — OTP (6 individual boxes)
  const [otp,     setOtp]     = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef([]);

  // Step 3
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);

  const str = getStrength(password);

  // ── STEP 1: Send OTP ────────────────────────────────────────────────────────
  // Track if OTP was already sent once (prevent double-send on step 1)
  const [otpSent, setOtpSent] = useState(false);

  // ── start countdown from a given number of seconds ─────────────────────────
  const startCountdown = (seconds) => {
    setResendCountdown(seconds);
    const interval = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address.'); return; }
    if (otpSent) return; // prevent double-click
    try {
      setLoading(true);
      setOtpSent(true);
      const res = await axios.post(`${API.user}/forgot-password`, { email });
      if (res.data.success) {
        toast.success('OTP sent! Check your inbox.');
        setStep(2);
        startCountdown(120); // 2 min matches backend cooldown
      } else {
        toast.error(res.data.message || 'Failed to send OTP.');
        setOtpSent(false);
      }
    } catch (err) {
      const d = err?.response?.data;
      if (d?.cooldown) {
        // Backend blocked — OTP already sent recently, just go to step 2
        toast.info(`OTP already sent. Check your inbox. Wait ${d.waitSec}s to resend.`);
        setStep(2);
        startCountdown(d.waitSec);
      } else {
        toast.error(d?.message || 'Something went wrong.');
        setOtpSent(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Resend countdown ────────────────────────────────────────────────────────
  const startResendCountdown = (seconds = 120) => startCountdown(seconds);

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return; // still in cooldown
    try {
      setLoading(true);
      const res = await axios.post(`${API.user}/forgot-password`, { email });
      if (res.data.success) {
        setOtp(['', '', '', '', '', '']);
        startCountdown(120);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
        toast.success('New OTP sent! Use the code from the LATEST email.');
      }
    } catch (err) {
      const d = err?.response?.data;
      if (d?.cooldown) {
        // Still in cooldown — tell user to use existing OTP
        startCountdown(d.waitSec);
        toast.warning(`Use the OTP already in your inbox. Resend available in ${d.waitSec}s.`);
      } else {
        toast.error(d?.message || 'Could not resend OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── OTP box handlers ────────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;          // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);           // only last digit
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
  };

  // ── STEP 2: Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length < 6) { toast.error('Enter all 6 digits.'); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${API.user}/verify-otp`, { email, otp: otpStr });
      if (res.data.success) {
        toast.success('OTP verified!');
        setStep(3);
      } else {
        toast.error(res.data.message || 'Invalid OTP.');
      }
    } catch (err) {
      const d = err?.response?.data;
      toast.error(d?.message || 'OTP verification failed.');
      if (d?.expired) setStep(1);   // restart if OTP expired
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: Reset Password ──────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 8)  { toast.error('Password must be at least 8 characters.'); return; }
    if (password !== confirm)  { toast.error('Passwords do not match.'); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${API.user}/reset-password`, { email, password });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(4);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.error(res.data.message || 'Reset failed.');
      }
    } catch (err) {
      const d = err?.response?.data;
      toast.error(d?.message || 'Reset failed.');
      if (d?.expired) { toast.error('Session expired. Please start over.'); setStep(1); }
    } finally {
      setLoading(false);
    }
  };

  // ── Progress indicator ──────────────────────────────────────────────────────
  const steps = ['Email', 'OTP', 'Password'];

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Back */}
          {step < 4 && (
            <Link to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500
                         hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          )}

          {/* Brand */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16
                            bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 1 && 'Forgot Password?'}
              {step === 2 && 'Enter OTP'}
              {step === 3 && 'New Password'}
              {step === 4 && 'Password Reset!'}
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              {step === 1 && "We'll send a 6-digit OTP to your email."}
              {step === 2 && `OTP sent to ${email}`}
              {step === 3 && 'Create a strong new password.'}
              {step === 4 && 'Redirecting to login…'}
            </p>
          </div>

          {/* Progress bar */}
          {step < 4 && (
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                    text-xs font-bold transition-all ${
                      i + 1 < step  ? 'bg-green-500 text-white' :
                      i + 1 === step ? 'bg-purple-600 text-white' :
                                       'bg-gray-100 text-gray-400'
                    }`}>
                      {i + 1 < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${
                      i + 1 === step ? 'text-purple-600' : 'text-gray-400'
                    }`}>{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 transition-all ${
                      i + 1 < step ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ══ STEP 1: Email ══════════════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500" />
                </div>
              </div>
              <Button type="submit" disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                           hover:from-purple-700 hover:to-blue-700 text-white font-semibold
                           text-base shadow-lg hover:shadow-xl transition-all">
                {loading
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending OTP...</>
                  : <>Send OTP <ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Remembered it?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* ══ STEP 2: OTP ════════════════════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">

              {/* Important notice */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-500 text-base mt-0.5 flex-shrink-0">⚠️</span>
                <p className="text-amber-800 text-xs leading-relaxed">
                  <strong>Always use the OTP from your LATEST email.</strong><br/>
                  If you requested multiple times, only the most recent OTP is valid.
                  Older emails are expired.
                </p>
              </div>

              {/* 6 OTP boxes */}
              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-3">
                  Enter the 6-digit OTP
                </Label>
                <div className="flex gap-3 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
                                  focus:outline-none focus:ring-2 transition-all ${
                        digit
                          ? 'border-purple-500 bg-purple-50 text-purple-700 focus:ring-purple-400'
                          : 'border-gray-300 focus:border-purple-500 focus:ring-purple-400'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Check inbox &amp; <strong>spam folder</strong> — use the <strong>latest</strong> email
                </p>
              </div>

              <Button type="submit" disabled={loading || otp.join('').length < 6}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                           hover:from-purple-700 hover:to-blue-700 text-white font-semibold
                           text-base shadow-lg hover:shadow-xl transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                  : <>Verify OTP <ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>

              {/* Resend */}
              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend available in{' '}
                    <span className="font-semibold text-purple-600">{resendCountdown}s</span>
                    <span className="text-xs text-gray-400 block mt-1">
                      Use the OTP already in your inbox
                    </span>
                  </p>
                ) : (
                  <button type="button" onClick={handleResendOtp} disabled={loading}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700
                               underline underline-offset-2 disabled:opacity-50">
                    Didn't receive it? Resend OTP
                  </button>
                )}
              </div>

              <button type="button" onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 text-center">
                ← Use a different email
              </button>
            </form>
          )}

          {/* ══ STEP 3: New Password ════════════════════════════════════════════ */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Password */}
              <div>
                <Label className="text-sm font-medium text-gray-700">New Password</Label>
                <div className="mt-2 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type={showPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password" required
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= str.score ? str.color : 'bg-gray-200'
                          }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{str.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="mt-2 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type={showConf ? 'text' : 'password'} value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password" required
                    className={`pl-10 pr-10 h-12 border-gray-300 focus:ring-purple-500 ${
                      confirm && confirm !== password
                        ? 'border-red-400 focus:border-red-500'
                        : 'focus:border-purple-500'
                    }`} />
                  <button type="button" onClick={() => setShowConf(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConf ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="mt-1 text-xs text-red-500">Passwords don't match</p>
                )}
              </div>

              <Button type="submit" disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                           hover:from-purple-700 hover:to-blue-700 text-white font-semibold
                           text-base shadow-lg hover:shadow-xl transition-all">
                {loading
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...</>
                  : <>Reset My Password <ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>
            </form>
          )}

          {/* ══ STEP 4: Success ════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center justify-center w-20 h-20
                              bg-green-50 border-2 border-green-200 rounded-full mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Password Updated!</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Your password has been reset successfully.
                  Redirecting to login in 3 seconds…
                </p>
              </div>
              <Link to="/login">
                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                                   hover:from-purple-700 hover:to-blue-700 text-white
                                   font-semibold shadow-lg hover:shadow-xl transition-all">
                  Go to Login <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* ── Right: Gradient panel ── */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700
                      items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            {step === 1 && 'No Worries!'}
            {step === 2 && 'Check Your Email!'}
            {step === 3 && 'Almost Done!'}
            {step === 4 && 'All Set!'}
          </h1>
          <p className="text-xl text-purple-100">
            {step === 1 && "Enter your email and we'll send a 6-digit OTP instantly."}
            {step === 2 && 'Enter the 6-digit OTP we sent to your inbox.'}
            {step === 3 && 'Create a new strong password for your account.'}
            {step === 4 && 'Your password has been reset. You can log in now.'}
          </p>
          <div className="space-y-4 pt-8">
            {[
              { title: 'Quick Process', sub: 'Takes less than 2 minutes' },
              { title: 'OTP Valid 10 min', sub: 'Use it before it expires' },
              { title: 'Secure Reset', sub: 'Your account stays protected' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-purple-100">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
