import React from 'react';
import { useRouteError, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw, ChevronLeft } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    console.error(error);

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 select-none">
            <div className="relative max-w-2xl w-full">
                {/* Decorative elements */}
                <div className="absolute -top-24 -left-20 w-64 h-64 bg-brand/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-20 w-64 h-64 bg-brand/5 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="relative bg-bg-card border border-border-dim rounded-[40px] p-8 md:p-16 shadow-2xl overflow-hidden group">
                    {/* Subtle pattern background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="relative flex flex-col items-center text-center space-y-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                                <AlertTriangle size={64} className="text-red-500" />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-bg-card p-2 rounded-2xl border border-border-dim shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black text-text-base tracking-tighter">
                                Oops!
                            </h1>
                            <p className="text-xl text-text-muted font-medium max-w-md mx-auto leading-relaxed">
                                Something went wrong. An unexpected error has occurred in the application.
                            </p>
                        </div>

                        {error?.message && (
                            <div className="w-full bg-bg-main/50 border border-border-dim rounded-2xl p-4 font-mono text-xs text-red-400 text-left overflow-x-auto max-h-32">
                                <span className="text-red-500 font-bold uppercase mr-2">[Error]</span>
                                {error.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center gap-3 bg-brand hover:bg-brand-hover text-white px-8 py-5 rounded-2xl font-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-brand/20 group/btn"
                            >
                                <RotateCcw size={22} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                                Try Reloading
                            </button>

                            <Link
                                to="/"
                                className="flex items-center justify-center gap-3 bg-bg-main border border-border-dim hover:border-brand/50 text-text-base px-8 py-5 rounded-2xl font-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg group/home"
                            >
                                <Home size={22} className="group-hover/home:scale-110 transition-transform" />
                                Back to Home
                            </Link>
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm font-bold text-text-muted hover:text-brand flex items-center gap-2 transition-colors group/back"
                        >
                            <ChevronLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                            Go to previous page
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs font-bold uppercase tracking-widest text-text-muted/40">
                    {new Date().getFullYear()} Ignite Learning Platform • System Diagnostic: OK
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
