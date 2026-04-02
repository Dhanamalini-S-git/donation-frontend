import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { PlusCircle, List, Gift, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, available: 0, accepted: 0, cancelled: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/donations/my');
        const total = data.length;
        const available = data.filter(d => d.status === 'available').length;
        const accepted = data.filter(d => d.status === 'accepted').length;
        const cancelled = data.filter(d => d.status === 'cancelled').length;
        setStats({ total, available, accepted, cancelled });
        setRecent(data.slice(0, 3));
      } catch (err) { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <PageWrapper
      title={`Welcome, ${user?.name?.split(' ')[0]}! 👋`}
      subtitle="Here's an overview of your donations"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={<Gift size={22} className="text-brand-600" />} label="Total Donated" value={stats.total} color="bg-brand-100" />
        <StatCard icon={<TrendingUp size={22} className="text-sage-600" />} label="Available" value={stats.available} color="bg-sage-100" />
        <StatCard icon={<CheckCircle size={22} className="text-green-600" />} label="Accepted" value={stats.accepted} color="bg-green-100" />
        <StatCard icon={<Clock size={22} className="text-gray-500" />} label="Cancelled" value={stats.cancelled} color="bg-gray-100" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/donor/create" className="card flex flex-col items-center gap-2 py-6 hover:border-brand-200 hover:shadow-md transition-all text-center group border-2 border-dashed border-gray-200">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center group-hover:bg-brand-500 transition-colors">
            <PlusCircle size={20} className="text-brand-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm font-semibold text-gray-700">New Donation</span>
        </Link>
        <Link to="/donor/my-donations" className="card flex flex-col items-center gap-2 py-6 hover:border-sage-200 hover:shadow-md transition-all text-center group border-2 border-dashed border-gray-200">
          <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center group-hover:bg-sage-500 transition-colors">
            <List size={20} className="text-sage-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm font-semibold text-gray-700">My Donations</span>
        </Link>
      </div>

      {/* Recent donations */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Recent Donations</h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse bg-gray-100" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="card text-center py-10">
            <Gift size={36} className="text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No donations yet.</p>
            <Link to="/donor/create" className="text-brand-500 text-sm font-medium mt-1 inline-block">Create your first donation →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(d => (
              <div key={d._id} className="card flex items-center gap-4">
                {d.image ? (
                  <img src={`/uploads/${d.image}`} alt={d.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Gift size={20} className="text-brand-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{d.name}</p>
                  <p className="text-xs text-gray-500">Qty: {d.quantity}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  d.status === 'available' ? 'bg-sage-100 text-sage-700' :
                  d.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{d.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default DonorDashboard;
