import React from 'react';

const Avatar = ({ user, size = "md" }) => {
    const name = user?.firstName || user?.email || "User";
    const initials = (user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase();

    // Deterministic color generation
    const colors = [
        "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500",
        "bg-cyan-500", "bg-teal-500", "bg-orange-500", "bg-brand"
    ];

    const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorClass = colors[charCodeSum % colors.length];

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-xl"
    };

    return (
        <div className={`${sizeClasses[size]} ${colorClass} text-white flex items-center justify-center font-bold rounded-xl shadow-lg shadow-black/5 border border-white/10 select-none transition-transform hover:scale-105 active:scale-95 cursor-default`}>
            {initials}
        </div>
    );
};

export default Avatar;
