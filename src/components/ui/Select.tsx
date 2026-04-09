import React from "react";

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    id?: string;
    value?: string | number;
    onChange: (value: any) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    id,
    value,
    onChange,
    options,
    placeholder = "Select...",
    error,
    disabled,
    className = ""
}) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <select
                id={id}
                value={value ?? ""}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    w-full
                    border rounded-lg px-3 py-2
                    bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition
                    ${error ? "border-red-500" : "border-slate-300"}
                    ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
                    ${className}
                `}
            >
                <option value="">{placeholder}</option>

                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && (
                <span className="text-red-500 text-xs">{error}</span>
            )}
        </div>
    );
};

export default Select;