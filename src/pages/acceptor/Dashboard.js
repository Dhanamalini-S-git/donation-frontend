import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { Search, FilePlus, Gift, FileText, CheckCircle, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FREE_LIMIT = 5;

const SubscriptionWall = ({ onSubscribe }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="card max-w-sm w-full border-violet-500/30 bg-[#13151f] animate-fade-up">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-ring">
          <Crown size={28} className="text-white"/>
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">Upgrade to Continue</h2>
        <p className="text-white/40 text-sm">You've used your {FREE_LIMIT} free sessions. Subscribe to keep using Donify.</p>
      </div>
      <div className="space-y-3 mb-6">
        {[
          { plan: 'basic', name: 'Basic', price: '₹299', period: '/month', color: 'from-violet-600 to-indigo-600', features: ['Unlimited access', 'Priority donations', 'Email support'] },
          { plan: 'pro',   name: 'Pro',   price: '₹799', period: '/quarter', color: 'from-amber-500 to-orange-500', badge: 'Best Value', features: ['All Basic features', 'Analytics', 'Dedicated manager'] },
        ].map(p => (
          <button key={p.plan} onClick={() => onSubscribe(p.plan)}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
              p.plan==='pro' ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10' : 'border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{p.name}</span>
                {p.badge && <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs">{p.badge}</span>}
              </div>
              <span className={`font-bold bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>
                {p.price}<span className="text-white/30 text-xs font-normal">{p.period}</span>
              </span>
            </div>
            <div className="flex gap-3">
              {p.features.map(f => <span key={f} className="text-xs text-white/40">{f}</span>)}
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-white/20">Secure payment • Cancel anytime</p>
    </div>
  </div>
);

const AcceptorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ available: 0, myRequests: 0, accepted: 0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showWall, setShowWall] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, reqRes] = await Promise.all([API.get('/donations'), API.get('/requests/my')]);
        setStats({
          available: donRes.data.length,
          myRequests: reqRes.data.length,
          accepted: reqRes.data.filter(r => r.status === 'fulfilled').length
        });
        setRecentDonations(donRes.data.slice(0, 3));
        try {
          const subRes = await API.get('/subscription/status');
          const count = subRes.data.usageCount || 0;
          setUsageCount(count);
          setIsSubscribed(subRes.data.subscription?.isActive || false);
          if (!subRes.data.subscription?.isActive && count >= FREE_LIMIT) setShowWall(true);
        } catch(e) {}
      } catch (err) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (plan) => {
    try {
      await API.post('/subscription/subscribe', { plan });
      setIsSubscribed(true);
      setShowWall(false);
    } catch(e) {}
  };

  return (
    <PageWrapper title={`Hello, ${user?.organizationName || user?.name?.split(' ')[0]}! 🤝`} subtitle="Browse donations or create requests">
      {showWall && <SubscriptionWall onSubscribe={handleSubscribe}/>}

      {isSubscribed ? (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-fade-up">
          <Crown size={14} className="text-amber-400"/>
          <span className="text-xs text-amber-400 font-medium">Premium Member — Unlimited Access</span>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4 px-3 py-2 bg-white/5 border border-white/8 rounded-xl animate-fade-up">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-violet-400"/>
            <span className="text-xs text-white/50">Free Plan — {Math.max(0, FREE_LIMIT - usageCount)} sessions left</span>
          </div>
          <button onClick={() => setShowWall(true)} className="text-xs text-violet-400 hover:text-violet-300 font-medium">Upgrade →</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Available', value: stats.available, color: 'text-violet-400', bg: 'bg-violet-500/10', icon: <Gift size={16}/> },
          { label: 'Requests',  value: stats.myRequests, color: 'text-blue-400',   bg: 'bg-blue-500/10',   icon: <FileText size={16}/> },
          { label: 'Fulfilled', value: stats.accepted,   color: 'text-emerald-400',bg: 'bg-emerald-500/10',icon: <CheckCircle size={16}/> },
        ].map((s, i) => (
          <div key={s.label} className={`card-hover text-center py-4 animate-fade-up stagger-${i+1}`}>
            <div className={`w-8 h-8 ${s.bg} rounded-xl mx-auto flex items-center justify-center ${s.color} mb-2`}>{s.icon}</div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/acceptor/donations" className="card-hover flex flex-col items-center gap-2 py-5 text-center group border-dashed border-white/10 hover:border-violet-500/30">
          <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <Search size={20} className="text-violet-400"/>
          </div>
          <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">Browse Donations</span>
        </Link>
        <Link to="/acceptor/create-request" className="card-hover flex flex-col items-center gap-2 py-5 text-center group border-dashed border-white/10 hover:border-emerald-500/30">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <FilePlus size={20} className="text-emerald-400"/>
          </div>
          <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">Create Request</span>
        </Link>
      </div>

      <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Latest Available</h2>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card h-16 animate-pulse bg-white/5"/>)}</div>
      ) : recentDonations.length === 0 ? (
        <div className="card text-center py-10">
          <Gift size={32} className="text-white/10 mx-auto mb-2"/>
          <p className="text-white/30 text-sm">No donations available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentDonations.map(d => (
            <div key={d._id} className="card-hover flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <Gift size={16} className="text-violet-400"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{d.name}</p>
                <p className="text-xs text-white/30">By {d.donorId?.name} · Qty: {d.quantity}</p>
              </div>
              <Link to="/acceptor/donations" className="text-xs text-violet-400 hover:text-violet-300 font-medium flex-shrink-0">Accept →</Link>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};
export default AcceptorDashboard;