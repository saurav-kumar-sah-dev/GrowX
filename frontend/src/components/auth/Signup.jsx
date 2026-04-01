import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import {
  User, Mail, Phone, Lock, Loader2,
  ArrowRight, Sparkles, MailCheck, Eye, EyeOff,
} from 'lucide-react';
import { API } from '@/config/api';

const getFirebaseAuth = async () => {
  const { getAuth, signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
  const { initializeApp, getApps } = await import('firebase/app');
  
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    return { auth, signInWithPopup, GoogleAuthProvider };
  } catch (err) {
    console.error("Firebase init error:", err);
    return null;
  }
};

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '', email: '', phoneNumber: '',
    password: '', role: 'student', file: '',
  });
  const [showPass,      setShowPass]      = useState(false);
  const [sentEmail,     setSentEmail]     = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resentCount,   setResentCount]   = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loading, user } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      const firebase = await getFirebaseAuth();
      if (!firebase) {
        toast.error("Google sign-up is not configured");
        setGoogleLoading(false);
        return;
      }
      const { auth, signInWithPopup, GoogleAuthProvider } = firebase;
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = await result.user.getIdToken();
      const res = await axios.post(
        `${API.user}/google`,
        { credential, role: input.role },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Account created successfully!");
      } else {
        toast.error(res.data.message || "Google signup failed");
      }
    } catch (err) {
      console.error("Google sign up error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Google signup failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
  const changeFileHandler  = (e) => setInput({ ...input, file: e.target.files?.[0] });

  const isValidEmail = (email) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    const [local, domain] = email.split('@');
    if (local.length < 3) return false;
    const parts = domain.split('.');
    return parts.length >= 2 && parts[parts.length - 1].length >= 2;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValidEmail(input.email)) {
      toast.error('Enter a valid email');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(input.password)) {
      toast.error('Password must be 8+ chars with uppercase, lowercase, number & special char (e.g., Krishna@1234)');
      return;
    }

    if (!input.fullname.trim() || !input.email.trim() || !input.password.trim()) {
      toast.error('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('fullname', input.fullname.trim());
    formData.append('email', input.email.trim());
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);
    if (input.file) formData.append('file', input.file);

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${API.user}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success('Account created!');
        navigate('/login');
        return;
      } else {
        dispatch(setLoading(false));
      }

    } catch (err) {
      toast.error(err?.response?.data?.message || 'Signup failed');
      dispatch(setLoading(false));
    }
  };

  // ── Resend ───────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    try {
      setResendLoading(true);
      const res = await axios.post(`${API.user}/resend-verification-email`, { email: sentEmail });
      if (res.data.success) {
        toast.success('Verification email resent! Check inbox and spam.');
        setResentCount((c) => c + 1);
      } else toast.error(res.data.message || 'Could not resend.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not resend.');
    } finally {
      setResendLoading(false);
    }
  };

  // ── Check your email screen ──────────────────────────────────────────────────
  if (sentEmail) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600
                        items-center justify-center p-12">
          <div className="max-w-md text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Verify Your Email</h1>
            <p className="text-xl text-blue-100">
              Just one more step — verify your email to unlock your account.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-8 bg-white overflow-y-auto">
          <div className="w-full max-w-md space-y-5 sm:space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20
                            bg-purple-50 border-2 border-purple-200 rounded-full mx-auto">
              <MailCheck className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Check your inbox!</h2>
              <p className="mt-2 sm:mt-3 text-gray-600 text-sm">We sent a verification link to:</p>
              <div className="inline-flex items-center gap-2 bg-purple-50 border-2 border-purple-200
                              rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 mt-2 sm:mt-3 max-w-full">
                <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="font-bold text-purple-700 text-xs sm:text-sm break-all">{sentEmail}</span>
              </div>
              <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm">
                Click the link to activate your account. Expires in <strong>5 days</strong>.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-left space-y-2.5 sm:space-y-3">
              {['Open your email app', 'Find the email from GrowX', 'Click "Verify My Email"', 'Come back and sign in!'].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white text-xs
                                   font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-gray-700 text-xs sm:text-sm">{s}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-left">
              <p className="text-amber-800 text-xs sm:text-sm">
                <strong>📁 Not in inbox?</strong> Check your <strong>spam / junk folder</strong>.
              </p>
            </div>
            <Button onClick={handleResend} disabled={resendLoading}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600
                         hover:from-purple-700 hover:to-blue-700 text-white font-semibold
                         text-sm shadow-lg hover:shadow-xl transition-all">
              {resendLoading
                ? <><Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> Resending...</>
                : <><MailCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Resend Verification Email</>}
            </Button>
            {resentCount > 0 && (
              <p className="text-green-600 text-xs">
                ✅ Resent {resentCount} time{resentCount > 1 ? 's' : ''}. Check spam too!
              </p>
            )}
            <p className="text-sm text-gray-500">
              Already verified?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Signup form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex">

      {/* Left: gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600
                      items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">Join Our Community</h1>
          <p className="text-xl text-blue-100">
            Create an account and unlock endless possibilities for growth.
          </p>
          <div className="space-y-4 pt-8">
            {[
              { title: 'Free Access',    sub: 'Start learning immediately' },
              { title: 'Track Progress', sub: 'Monitor your learning journey' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-blue-100">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16
                            bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Start your learning journey today</p>
          </div>

          {/* Login / Sign Up toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { label: 'Login',   path: '/login'  },
              { label: 'Sign Up', path: '/signup' },
            ].map((item) => (
              <button key={item.label} type="button"
                onClick={() => navigate(item.path)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  item.label === 'Sign Up'
                    ? 'bg-white shadow text-purple-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={submitHandler} className="space-y-4 sm:space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-700">Full Name</Label>
              <div className="mt-1.5 sm:mt-2 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input name="fullname" value={input.fullname} onChange={changeEventHandler}
                  placeholder="John Doe" required
                  className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm border-gray-300
                             focus:border-purple-500 focus:ring-purple-500" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <div className="mt-1.5 sm:mt-2 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input type="email" name="email" value={input.email} onChange={changeEventHandler}
                  placeholder="you@example.com" required
                  className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm border-gray-300
                             focus:border-purple-500 focus:ring-purple-500" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Phone</Label>
              <div className="mt-1.5 sm:mt-2 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler}
                  placeholder="9876543210" required
                  className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm border-gray-300
                             focus:border-purple-500 focus:ring-purple-500" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <div className="mt-1.5 sm:mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input type={showPass ? 'text' : 'password'} name="password"
                  value={input.password} onChange={changeEventHandler}
                  placeholder="e.g., Krishna@1234" required minLength={8}
                  className="pl-9 sm:pl-10 pr-10 h-11 sm:h-12 text-sm border-gray-300
                             focus:border-purple-500 focus:ring-purple-500" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            {/* Profile photo — hidden on small screens, shown from sm up */}
            <div className="hidden sm:block">
              <Label className="text-sm font-medium text-gray-700">Profile Photo (Optional)</Label>
              <div className="mt-1.5 sm:mt-2">
                <Input type="file" accept="image/*" onChange={changeFileHandler}
                  className="h-11 sm:h-12 cursor-pointer border-gray-300 focus:border-purple-500 text-sm" />
              </div>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 text-white font-semibold
                         text-sm sm:text-base shadow-lg hover:shadow-xl transition-all">
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> Creating account...</>
                : <>Create Account <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></>}
            </Button>
          </form>

          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full h-11 sm:h-12 border-2 border-gray-300 hover:border-gray-400 
                         hover:bg-gray-50 transition-all font-semibold text-sm flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Sign up with Google
            </Button>
            
            <Link to="/admin/login" className="block">
              <Button type="button" variant="outline"
                className="w-full h-10 sm:h-11 border-2 border-slate-700 text-slate-700
                           hover:bg-slate-700 hover:text-white transition-all font-semibold text-sm">
                Admin Login
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
