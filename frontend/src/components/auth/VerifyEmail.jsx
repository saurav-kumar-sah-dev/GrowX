import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Mail, Loader2, CheckCircle2, XCircle, ArrowRight, Sparkles, MailCheck, AlertTriangle } from 'lucide-react';
import { API } from '@/config/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");

    const [status, setStatus] = useState("loading");
    const [resendEmail, setResendEmail] = useState(emailFromUrl || "");
    const [resending, setResending] = useState(false);
    const [resentOk, setResentOk] = useState(false);

    // ── Auto-verify on mount ──────────────────────────────────────────────────
    useEffect(() => {
        if (!token || !emailFromUrl) { setStatus("error"); return; }

        (async () => {
            try {
                const res = await axios.get(`${API.user}/verify-email`, {
                    params: { token, email: emailFromUrl }
                });
                setStatus(res.data.alreadyDone ? "already" : "success");
            } catch (err) {
                const d = err?.response?.data;
                setStatus(d?.expired ? "expired" : "error");
            }
        })();
    }, [token, emailFromUrl]);

    // ── Resend ────────────────────────────────────────────────────────────────
    const handleResend = async (e) => {
        e.preventDefault();
        if (!resendEmail) { toast.error("Enter your email address."); return; }
        try {
            setResending(true);
            const res = await axios.post(`${API.user}/resend-verification-email`, { email: resendEmail });
            if (res.data.success) { setResentOk(true); toast.success("New link sent! Check your inbox."); }
            else toast.error(res.data.message || "Could not resend.");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Could not resend.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* ── Left: Status card ── */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">

                    {/* Brand */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16
                                        bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* ── Loading ── */}
                    {status === "loading" && (
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20
                                            bg-purple-50 border-2 border-purple-200 rounded-full mx-auto">
                                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Verifying…</h2>
                            <p className="text-gray-600">Just a moment please.</p>
                        </div>
                    )}

                    {/* ── Success ── */}
                    {status === "success" && (
                        <div className="space-y-6 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20
                                            bg-green-50 border-2 border-green-200 rounded-full mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Email Verified! 🎉</h2>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    Your account is now fully active. You can sign in.
                                </p>
                            </div>
                            <Link to="/login">
                                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                                                   hover:from-purple-700 hover:to-blue-700 text-white
                                                   font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Go to Sign In <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* ── Already verified ── */}
                    {status === "already" && (
                        <div className="space-y-6 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20
                                            bg-blue-50 border-2 border-blue-200 rounded-full mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Already Verified</h2>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    Your email was already confirmed. Go ahead and sign in.
                                </p>
                            </div>
                            <Link to="/login">
                                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                                                   hover:from-purple-700 hover:to-blue-700 text-white
                                                   font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Go to Sign In <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* ── Expired — resend form ── */}
                    {status === "expired" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20
                                                bg-amber-50 border-2 border-amber-200 rounded-full mx-auto mb-4">
                                    <AlertTriangle className="w-10 h-10 text-amber-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Link Expired</h2>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    This verification link has expired. Enter your email below and
                                    we'll send a fresh one.
                                </p>
                            </div>

                            {resentOk ? (
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center space-y-3">
                                    <MailCheck className="w-8 h-8 text-green-600 mx-auto" />
                                    <p className="font-bold text-green-800">New link sent!</p>
                                    <p className="text-sm text-green-700">Check your inbox and click the verification link.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleResend} className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Your Email Address</Label>
                                        <div className="mt-2 relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input type="email" value={resendEmail}
                                                onChange={(e) => setResendEmail(e.target.value)}
                                                placeholder="you@example.com" required
                                                className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500" />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={resending}
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                                                   hover:from-purple-700 hover:to-blue-700 text-white
                                                   font-semibold shadow-lg hover:shadow-xl transition-all">
                                        {resending
                                            ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                                            : <><MailCheck className="mr-2 h-5 w-5" /> Send New Verification Email</>}
                                    </Button>
                                </form>
                            )}

                            <p className="text-center text-sm text-gray-500">
                                Back to{" "}
                                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">Sign in</Link>
                                {" "}or{" "}
                                <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-700">Sign up</Link>
                            </p>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {status === "error" && (
                        <div className="space-y-6 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20
                                            bg-red-50 border-2 border-red-200 rounded-full mx-auto">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Invalid Link</h2>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    This verification link is invalid. Please register again.
                                </p>
                            </div>
                            <Link to="/signup">
                                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600
                                                   hover:from-purple-700 hover:to-blue-700 text-white
                                                   font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Back to Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>

            {/* ── Right: Gradient panel ── */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700
                            items-center justify-center p-12">
                <div className="max-w-md text-white space-y-6">
                    <h1 className="text-5xl font-bold leading-tight">Verify Your Email</h1>
                    <p className="text-xl text-purple-100">
                        Confirming your email keeps your account secure and unlocks all platform features.
                    </p>
                    <div className="space-y-4 pt-8">
                        {[
                            { title: "Secure Account", sub: "We confirm it's really you" },
                            { title: "Full Access",    sub: "Unlock all platform features" },
                            { title: "Quick & Easy",   sub: "Just one click in your inbox" },
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
};

export default VerifyEmail;
