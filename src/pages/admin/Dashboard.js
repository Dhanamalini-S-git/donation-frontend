import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { Users, Gift, Clock, FileText, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, pendingAcceptors: 0, totalDonations: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={22} />, color: 'bg-brand-100 text-brand-600', path: null },
    { label: 'Pending Approvals', value: stats.pendingAcceptors, icon: <Clock size={22} />, color: 'bg-amber-100 text-amber-600', path: '/admin/pending' },
    { label: 'Total Donations', value: stats.totalDonations, icon: <Gift size={22} />, color: 'bg-sage-100 text-sage-600', path: null },
    { label: 'Total Requests', value: stats.totalRequests, icon: <FileText size={22} />, color: 'bg-purple-100 text-purple-600', path: null },
  ];

  return (
    <PageWrapper title="Admin Dashboard" subtitle="Platform overview and management">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cards.map(c => {
          const inner = (
            <div className="card flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}>{c.icon}</div>
              <div>
                {loading ? <div className="w-12 h-6 bg-gray-200 rounded animate-pulse mb-1" /> : (
                  <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                )}
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            </div>
          );
          return c.path ? <Link key={c.label} to={c.path}>{inner}</Link> : <div key={c.label}>{inner}</div>;
        })}
      </div>

      {/* Alert for pending */}
      {stats.pendingAcceptors > 0 && (
        <Link to="/admin/pending" className="block card border-l-4 border-amber-400 bg-amber-50 hover:shadow-md transition-shadow mb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">{stats.pendingAcceptors} organization(s) waiting for approval</p>
              <p className="text-xs text-amber-600 mt-0.5">Tap to review and approve →</p>
            </div>
          </div>
        </Link>
      )}

      {/* Quick nav */}
      <Link to="/admin/pending" className="card flex items-center gap-4 hover:shadow-md transition-shadow border-2 border-dashed border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
          <Clock size={22} className="text-brand-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">Pending Acceptors</p>
          <p className="text-sm text-gray-500">Review organization applications</p>
        </div>
      </Link>
    </PageWrapper>
  );
};

export default AdminDashboard;
