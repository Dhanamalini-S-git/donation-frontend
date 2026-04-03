import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { PlusCircle, List, Gift, TrendingUp, CheckCircle, Clock, Trophy, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const REWARD_TIERS = [
  { count: 3,  label: '₹10 Cash',       emoji: '💰' },
  { count: 6,  label: '₹20 Recharge',   emoji: '📱' },
  { count: 10, label: '15% Discount',   emoji: '🎁' },
  { count: 15, label: '₹50 Cash',       emoji: '💎' },
  { count: 20, label: '₹100 Recharge',  emoji: '🏆' },
];

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, available: 0, accepted: 0, cancelled: 0 });
  const [recent, setRecent] = useState([]);
  const [donationCount, setDonationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/donations/my');
        setStats({
          total: data.length,
          available: data.filter(d => d.status === 'available').length,
          accepted: data.filter(d => d.status === 'accepted').length,
          cancelled: data.filter(d => d.status === 'cancelled').length,
        });
        setRecent(data.slice(0, 3));
        setDonationCount(data.length);
      } catch (err) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const nextTier = REWARD_TIERS.find(t => t.count > donationCount);
  const progressPct = nextTier ? Math.min((donationCount / nextTier.count) * 100, 100) : 100;

  return (
    <PageWrapper title={`Hey, ${user?.name?.split(' ')[0]}! 👋`} subtitle="Your donation overview">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { icon: <Gift size={18}/>, label: 'Total Donated', value: stats.total, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { icon: <TrendingUp size={18}/>, label: 'Available', value: stats.available, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: <CheckCircle size={18}/>, label: 'Accepted', value: stats.accepted, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: <Clock size={18}/>, label: 'Cancelled', value: stats.cancelled, color: 'text-white/30', bg: 'bg-white/5' },
        ].map((s, i) => (
          <div key={s.label} className={`card-hover p-4 animate-fade-up stagger-${i+1}`}>
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rewards Progress */}
      <div className="card mb-5 animate-fade-up stagger-3 border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-white">Rewards Progress</span>
          </div>
          <Link to="/donor/my-donations" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
            View <ChevronRight size={12}/>
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-bold text-white">{donationCount}</span>
          <span className="text-white/40 text-sm">donations</span>
          {nextTier && <span className="text-white/30 text-xs ml-auto">{nextTier.count - donationCount} more for {nextTier.emoji} {nextTier.label}</span>}
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between mt-3">
          {REWARD_TIERS.slice(0,4).map(t => (
            <div key={t.count} className="text-center">
              <span className={`text-base ${donationCount >= t.count ? 'opacity-100' : 'opacity-20'}`}>{t.emoji}</span>
              <p className={`text-xs mt-0.5 ${donationCount >= t.count ? 'text-violet-400' : 'text-white/20'}`}>{t.count}</p>
            </div>
          ))}
          <div className="text-center">
            <Star size={16} className={`mx-auto ${donationCount >= 20 ? 'text-yellow-400' : 'text-white/20'}`}/>
            <p className={`text-xs mt-0.5 ${donationCount >= 20 ? 'text-yellow-400' : 'text-white/20'}`}>20</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/donor/create" className="card-hover flex flex-col items-center gap-2 py-5 text-center group border-dashed border-white/10 hover:border-violet-500/30">
          <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <PlusCircle size={20} className="text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">New Donation</span>
        </Link>
        <Link to="/donor/my-donations" className="card-hover flex flex-col items-center gap-2 py-5 text-center group border-dashed border-white/10 hover:border-emerald-500/30">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <List size={20} className="text-emerald-400" />
          </div>
          <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">My Donations</span>
        </Link>
      </div>

      {/* Recent */}
      <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Recent Donations</h2>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse bg-white/5"/>)}</div>
      ) : recent.length === 0 ? (
        <div className="card text-center py-10">
          <Gift size={32} className="text-white/10 mx-auto mb-2"/>
          <p className="text-white/30 text-sm">No donations yet</p>
          <Link to="/donor/create" className="text-violet-400 text-sm mt-2 inline-block hover:text-violet-300">Create your first →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map(d => (
            <div key={d._id} className="card-hover flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <Gift size={16} className="text-violet-400"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{d.name}</p>
                <p className="text-xs text-white/30">Qty: {d.quantity}</p>
              </div>
              <span className={`badge text-xs px-2 py-1 ${
                d.status==='available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                d.status==='accepted'  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                'bg-white/5 text-white/30 border border-white/10'}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};
export default DonorDashboard;