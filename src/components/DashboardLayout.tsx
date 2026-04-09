import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from "@/components/ui/LanguageSelector";

const menuItems = [
    { label: 'Home', icon: '🏠', path: '/dashboard' },
    { label: 'Invoices', icon: '🧾', path: '/invoices' },
    { label: 'Providers', icon: '🏢', path: '/providers' },
    { label: 'Articles', icon: '📦', path: '/articles' },
    { label: 'Prices', icon: '💲', path: '/prices' },
    { label: 'Users', icon: '👤', path: '/users' },
    { label: 'Sales', icon: '🛒', path: '/sales' },
    { label: 'Inventory', icon: '📊', path: '/inventory' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

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
                <div className="px-6 py-4 text-xl font-bold">Hotel Manager</div>

                <nav className="flex-1 px-2 space-y-2">
                    {menuItems.map(item => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                                flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800
                                ${location.pathname === item.path ? 'bg-slate-800' : ''}
                            `}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="px-6 py-4 text-xs text-slate-400">
                    © 2024 Hotel Manager
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex flex-col md:ml-64 transition-all">

                {/* TOPBAR */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">

                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden text-xl"
                    >
                        ☰
                    </button>

                    <div className="font-semibold text-slate-700">
                        Dashboard
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />
                        <button className="bg-slate-100 px-3 py-2 rounded-lg">
                            User
                        </button>
                    </div>

                </header>

                {/* CONTENT */}
                <main className="flex-1 p-4 md:p-8 w-full overflow-hidden">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;