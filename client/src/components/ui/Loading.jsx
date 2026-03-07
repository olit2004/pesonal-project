import React from 'react';

const Loading = ({ fullScreen = false, text = "Loading..." }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-main/80 backdrop-blur-sm"
        : "flex flex-col items-center justify-center p-12 w-full min-h-[400px]";

    return (
        <div className={containerClasses}>
            <div className="relative w-16 h-16">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-brand/20 rounded-full"></div>
                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-t-brand border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                {/* Inner Pulsing Circle */}
                <div className="absolute inset-4 bg-brand/10 rounded-full animate-pulse"></div>
            </div>
            {text && (
                <p className="mt-4 text-text-muted font-bold tracking-widest text-sm uppercase animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loading;
