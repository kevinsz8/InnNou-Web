import { useState, useRef, useEffect } from "react";
import i18n from "i18next";

const languages = [
    { code: "en", label: "English", short: "EN", flag: "/flags/us.svg" },
    { code: "es", label: "Español", short: "ES", flag: "/flags/es.svg" },
    { code: "ca", label: "Català", short: "CA", flag: "/flags/cat.svg" }
];

const LanguageSelector = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = i18n.resolvedLanguage || "en";
    const current = languages.find(l => currentLang.startsWith(l.code)) || languages[0];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setOpen(false);
    };

    // 🔥 cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            
            {/* 🔘 BUTTON */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium"
            >
                <span>
                    <img
                        src={current.flag}
                        alt={current.label}
                        className="w-5 h-5 object-cover rounded-sm"
                    /></span>
                <span>{current.short}</span>
                <span className="text-xs">▼</span>
            </button>

            {/* 📂 DROPDOWN */}
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`
                                w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-100
                                ${current.code === lang.code ? "bg-slate-100 font-semibold" : ""}
                            `}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.label}
                                className="w-5 h-5 object-cover rounded-sm"
                            />
                            <span>{lang.label}</span>
                        </button>
                    ))}

                </div>
            )}
        </div>
    );
};

export default LanguageSelector;