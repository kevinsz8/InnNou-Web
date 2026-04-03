import React from 'react';
import { Link } from 'react-router-dom';

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

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex bg-slate-50">
    {/* Sidebar */}
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-20">
      <div className="px-6 py-4 text-xl font-bold tracking-tight">Hotel Manager</div>
            <nav className="flex-1 px-2 space-y-2">
                {menuItems.map(item => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 ${location.pathname === item.path ? 'bg-slate-800' : ''
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
      <div className="px-6 py-4 mt-auto text-xs text-slate-400">© 2024 Hotel Manager</div>
    </aside>
    {/* Main content area */}
    <div className="flex-1 flex flex-col ml-64">
      {/* Topbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="font-semibold text-slate-700">Dashboard</div>
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200">User</button>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
