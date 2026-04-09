import React, { useState } from "react";

interface PasswordInputProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

// 🔥 VALIDADORES
const hasUppercase = (val: string) => /[A-Z]/.test(val);
const hasLowercase = (val: string) => /[a-z]/.test(val);
const hasNumber = (val: string) => /[0-9]/.test(val);

// ✅ FIX REAL → solo caracteres válidos definidos
const hasSpecialChar = (val: string) =>
    /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(val);

// 🔥 strength helper
const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++; // bonus real

    if (hasUppercase(password)) score++;
    if (hasLowercase(password)) score++;
    if (hasNumber(password)) score++;
    if (hasSpecialChar(password)) score++;

    return score; // max = 6
};

const PasswordInput: React.FC<PasswordInputProps> = ({
    id,
    value,
    onChange,
    placeholder = "Password",
    error,
    disabled
}) => {
    const [show, setShow] = useState(false);

    const strength = getPasswordStrength(value);

    // 🔥 UX FIX → 5 ya es “perfect usable”
    const MAX_SCORE = 5;
    const normalized = Math.min(strength, MAX_SCORE);
    const percentage = (normalized / MAX_SCORE) * 100;

    const getColor = () => {
        if (strength <= 2) return "bg-red-500";
        if (strength === 3) return "bg-orange-500";
        if (strength === 4) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getLabel = () => {
        if (strength <= 1) return "Weak password";
        if (strength === 2) return "Fair password";
        if (strength === 3) return "Good password";
        if (strength === 4) return "Strong password";
        return "Strongest password";
    };

    return (
        <div className="flex flex-col gap-2 w-full">

            {/* INPUT */}
            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="new-password"
                    className={`
                        w-full border rounded-lg px-3 py-2 pr-10
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition
                        ${error ? "border-red-500" : "border-slate-300"}
                        ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
                    `}
                />

                {/* 👁️ toggle */}
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-2 top-2 text-slate-500 hover:text-slate-700"
                >
                    {show ? "🙈" : "👁️"}
                </button>
            </div>

            {/* ERROR */}
            {error && (
                <span className="text-red-500 text-xs">{error}</span>
            )}

            {/* STRENGTH BAR */}
            {value && (
                <div className="space-y-2">
                    <div className="h-2 bg-slate-200 rounded">
                        <div
                            style={{ width: `${percentage}%` }}
                            className={`h-2 rounded transition-all duration-300 ${getColor()}`}
                        />
                    </div>

                    <span className="text-xs text-slate-500">
                        {getLabel()}
                    </span>
                </div>
            )}

            {/* RULES */}
            {value && (
                <div className="text-xs space-y-1">
                    <div className={value.length >= 8 ? "text-green-500" : "text-red-500"}>
                        • At least 8 characters
                    </div>

                    <div className={hasUppercase(value) ? "text-green-500" : "text-red-500"}>
                        • One uppercase letter
                    </div>

                    <div className={hasLowercase(value) ? "text-green-500" : "text-red-500"}>
                        • One lowercase letter
                    </div>

                    <div className={hasNumber(value) ? "text-green-500" : "text-red-500"}>
                        • One number
                    </div>

                    <div className={hasSpecialChar(value) ? "text-green-500" : "text-red-500"}>
                        • One special character
                    </div>
                </div>
            )}

        </div>
    );
};

export default PasswordInput;