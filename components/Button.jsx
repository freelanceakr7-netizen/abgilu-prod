import React from 'react';

export const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center transition-all duration-700 ease-out overflow-hidden uppercase tracking-widest text-[10px] sm:text-xs font-medium";

    const variants = {
        primary: `bg-indigo text-kora hover:bg-terracotta`,
        secondary: `bg-terracotta text-kora hover:bg-indigo`,
        outline: `border border-indigo text-indigo hover:border-terracotta hover:text-terracotta`
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-8 py-4",
        lg: "px-12 py-5"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {/* Subtle grain overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        </button>
    );
};


