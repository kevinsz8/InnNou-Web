import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard: React.FC = () => (
  <DashboardLayout>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="font-semibold text-slate-700 mb-2">Welcome!</div>
        <div className="text-slate-500">This is your hotel management dashboard.</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="font-semibold text-slate-700 mb-2">Quick Stats</div>
        <div className="text-slate-500">Show stats, charts, or widgets here.</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="font-semibold text-slate-700 mb-2">Recent Activity</div>
        <div className="text-slate-500">Show recent actions, invoices, or updates.</div>
      </div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
