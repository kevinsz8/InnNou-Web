import React from 'react';

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading?: boolean;
    variant?: Variant;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
    loading?: boolean;
    variant?: Variant;
  id?: string;
}

const baseStyles = "px-4 py-2 rounded disabled:opacity-50";

const variantStyles: Record<Variant, string> = {
    primary: "bg-slate-800 text-white hover:bg-slate-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-500",
};

const Button: React.FC<ButtonProps> = ({
    id,
    children,
    loading,
    variant = "primary",
    className = "",
    ...props
}) => (
    <button
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        disabled={loading || props.disabled}
        {...props}
    >
        {loading ? 'Loading...' : children}
    </button>
);

export default Button;
