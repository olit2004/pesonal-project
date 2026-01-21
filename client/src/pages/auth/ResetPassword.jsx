import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPassword } from "../../service/auth";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            setIsSubmitted(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Failed to reset password. The link may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 bg-bg-main">
            <div className="bg-bg-card border border-border-dim p-10 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden group">
                {/* Subtle Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/10 blur-3xl rounded-full group-hover:bg-brand/20 transition-all duration-500"></div>

                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-text-muted hover:text-brand mb-8 transition-colors group/back font-bold text-sm"
                >
                    <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                {!isSubmitted ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl font-black text-text-base mb-2">Reset Password</h2>
                            <p className="text-text-muted">Enter your new password below to secure your account.</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium animate-shake">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-main border border-border-dim focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all placeholder:text-text-muted/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-main border border-border-dim focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all placeholder:text-text-muted/50"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-brand text-white font-black rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Update Password
                                        <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-text-base mb-2">Password Reset!</h2>
                            <p className="text-text-muted">
                                Your password has been successfully updated. <br />
                                <span className="text-text-base font-bold underline decoration-brand/30 italic">Redirecting to login...</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
