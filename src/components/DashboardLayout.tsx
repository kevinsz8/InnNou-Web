import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { forceLogout } from "@/utils/authSession";
import { useAuth } from '../core/auth/authContext';
import { useStopImpersonation } from '../hooks/users/useStopImpersonation';
import FullScreenLoader from './ui/FullScreenLoader';

const menuItems = [
    { key: 'home', icon: '🏠', path: '/dashboard' },
    { key: 'invoices', icon: '🧾', path: '/invoices' },
    { key: 'providers', icon: '🏢', path: '/providers' },
    { key: 'articles', icon: '📦', path: '/articles' },
    { key: 'prices', icon: '💲', path: '/prices' },
    { key: 'hotels', icon: '🏠', path: '/hotels' },
    { key: 'users', icon: '👤', path: '/users' },
    { key: 'sales', icon: '🛒', path: '/sales' },
    { key: 'inventory', icon: '📊', path: '/inventory' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isImpersonating, impersonatedEmail, actorEmail } = useAuth();
    const { stop, loading: stopping } = useStopImpersonation();

    const location = useLocation();
    const { t } = useTranslation();

    const menuRef = useRef<HTMLDivElement>(null);

    // 🔥 CLOSE MENU ON OUTSIDE CLICK
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* OVERLAY MOBILE */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-20
                transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}>
                <div className="px-6 py-4 text-xl font-bold">InnNou</div>

                <nav className="flex-1 px-2 space-y-2">
                    {menuItems.map(item => (
                        <Link
                            key={item.key}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                                flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800
                                ${location.pathname === item.path ? 'bg-slate-800' : ''}
                            `}
                        >
                            <span>{item.icon}</span>
                            <span>{t(`menu.${item.key}`)}</span>
                        </Link>
                    ))}
                </nav>

                <div className="px-6 py-4 text-xs text-slate-400">
                    © 2026 InnNou
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex flex-col md:ml-64 transition-all">

                {/* TOPBAR */}
                <header className={`
                    h-16 border-b flex items-center justify-between px-4 md:px-8 gap-4
                    ${isImpersonating ? "bg-red-50 border-red-200" : "bg-white"}
                `}>

                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden text-xl"
                    >
                        ☰
                    </button>

                    <div className="font-semibold text-slate-700">
                        {t("layout.dashboard")}
                    </div>

                    {/* 🔥 IMPERSONATION MODE PRO */}
                    {isImpersonating && (
                        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                            <span className="font-medium">
                                {actorEmail} {t("auth.Impersonated")} → {impersonatedEmail}
                            </span>

                            <button
                                onClick={stop}
                                disabled={stopping}
                                className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs disabled:opacity-50"
                            >
                                {stopping ? "..." : t("auth.stopImpersonated")}
                            </button>

                        </div>
                    )}

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4 relative" ref={menuRef}>

                        <LanguageSelector />

                        {/* USER BUTTON */}
                        <button
                            onClick={() => setUserMenuOpen(prev => !prev)}
                            className="bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 transition"
                        >
                            👤
                        </button>

                        {/* DROPDOWN */}
                        {userMenuOpen && (
                            <div className="absolute right-0 top-14 w-48 bg-white border rounded-lg shadow-lg py-2 z-50 animate-fade-in">

                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100">
                                    {t("layout.profile")}
                                </button>

                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100">
                                    {t("layout.settings")}
                                </button>

                                <hr className="my-2" />

                                <button
                                    onClick={forceLogout}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                                >
                                    {t("layout.logout")}
                                </button>

                            </div>
                        )}
                    </div>

                </header>

                {/* CONTENT */}
                <main className="flex-1 p-4 md:p-8 w-full overflow-hidden">
                    {children}
                </main>
                <FullScreenLoader
                    open={stopping}
                    title={t("auth.SwitchUserLoaderTitle")}
                    subtitle={t("auth.SwitchUserLoaderSubtitle")}
                />
            </div>
        </div>
    );
};

export default DashboardLayout;