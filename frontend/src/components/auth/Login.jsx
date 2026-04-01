import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  MailCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { API } from "@/config/api";

const getFirebaseAuth = async () => {
  const { getAuth, signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
  const { initializeApp, getApps } = await import("firebase/app");
  
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

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const [showPass, setShowPass] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resentOk, setResentOk] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loading, user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const firebase = await getFirebaseAuth();
      if (!firebase) {
        toast.error("Google sign-in is not configured");
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
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Login successful");
      } else {
        toast.error(res.data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      toast.error(err?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate(user.role === "recruiter" ? "/admin/dashboard" : from, {
        replace: true,
      });
    }
  }, [user, navigate, from]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const resendVerification = async () => {
    try {
      setResendLoading(true);
      setResentOk(false);

      const res = await axios.post(
        `${API.user}/resend-verification-email`,
        { email: unverifiedEmail },
        { withCredentials: true }
      );

      if (res.data.success) {
        setResentOk(true);
        toast.success("Verification email resent! Check inbox and spam.");
      } else {
        toast.error(res.data.message || "Failed to resend.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend.");
    } finally {
      setResendLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setUnverifiedEmail(null);
    setResentOk(false);

    if (!input.email.trim() || !input.password.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${API.user}/login`,
        {
          email: input.email.trim(),
          password: input.password,
          role: input.role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Login successful");
      } else {
        toast.error(res.data.message || "Login failed.");
        dispatch(setLoading(false));
      }
    } catch (err) {
      const d = err?.response?.data;
      toast.error(d?.message || "Login failed.");

      if (err?.response?.status === 403 && d?.notVerified) {
        setUnverifiedEmail(d.email || input.email);
      }

      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Brand */}
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16
                            bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-3 sm:mb-4"
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Sign in to continue your journey
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { label: "Login", path: "/login" },
              { label: "Sign Up", path: "/signup" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  item.label === "Login"
                    ? "bg-white shadow text-purple-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="mt-1.5 sm:mt-2 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm border-gray-300
                             focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1.5 sm:mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="e.g., Krishna@1234"
                  autoComplete="current-password"
                  className="pl-9 sm:pl-10 pr-10 h-11 sm:h-12 text-sm border-gray-300
                             focus:border-purple-500 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600
                         hover:from-purple-700 hover:to-blue-700 text-white font-semibold
                         text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Unverified */}
          {unverifiedEmail && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4 space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-amber-900 text-sm">
                    Email Not Verified
                  </p>
                  <p className="text-xs sm:text-sm text-amber-800 mt-1 break-all">
                    <strong>{unverifiedEmail}</strong> hasn't been verified.
                    Check inbox or resend below.
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Check your <strong>spam / junk folder</strong> too.
                  </p>
                </div>
              </div>

              {resentOk && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-green-700 text-xs sm:text-sm font-medium">
                    New link sent!
                  </p>
                </div>
              )}

              <Button
                type="button"
                onClick={resendVerification}
                disabled={resendLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold
                           py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <MailCheck className="w-4 h-4" /> Resend Verification Email
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Bottom */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
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
              Continue with Google
            </Button>

            <Link to="/admin/login" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 sm:h-11 border-2 border-slate-700 text-slate-700
                           hover:bg-slate-700 hover:text-white transition-all font-semibold text-sm"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right */}
      <div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700
                      items-center justify-center p-12"
      >
        <div className="max-w-md text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Start Your Learning Journey Today
          </h1>
          <p className="text-xl text-purple-100">
            Join thousands of learners achieving their goals with our platform.
          </p>
          <div className="space-y-4 pt-8">
            {[
              { title: "Interactive Learning", sub: "Engage with hands-on projects" },
              { title: "Expert Mentorship", sub: "Learn from industry professionals" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
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
};

export default Login;
