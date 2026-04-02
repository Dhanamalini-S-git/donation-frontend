import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { Search, FilePlus, Gift, FileText, CheckCircle } from 'lucide-react';

const AcceptorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ available: 0, myRequests: 0, accepted: 0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, reqRes] = await Promise.all([
          API.get('/donations'),
          API.get('/requests/my')
        ]);
        setStats({
          available: donRes.data.length,
          myRequests: reqRes.data.length,
          accepted: reqRes.data.filter(r => r.status === 'fulfilled').length
        });
        setRecentDonations(donRes.data.slice(0, 3));
      } catch (err) { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <PageWrapper
      title={`Hello, ${user?.organizationName || user?.name?.split(' ')[0]}! 🤝`}
      subtitle="Browse available donations or create requests"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Available', value: stats.available, color: 'bg-brand-100 text-brand-600', icon: <Gift size={18} /> },
          { label: 'My Requests', value: stats.myRequests, color: 'bg-sage-100 text-sage-600', icon: <FileText size={18} /> },
          { label: 'Fulfilled', value: stats.accepted, color: 'bg-green-100 text-green-600', icon: <CheckCircle size={18} /> },
        ].map(s => (
          <div key={s.label} className="card text-center py-4">
            <div className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/acceptor/donations" className="card flex flex-col items-center gap-2 py-6 hover:border-brand-200 hover:shadow-md transition-all text-center group border-2 border-dashed border-gray-200">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center group-hover:bg-brand-500 transition-colors">
            <Search size={20} className="text-brand-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Browse Donations</span>
        </Link>
        <Link to="/acceptor/create-request" className="card flex flex-col items-center gap-2 py-6 hover:border-sage-200 hover:shadow-md transition-all text-center group border-2 border-dashed border-gray-200">
          <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center group-hover:bg-sage-500 transition-colors">
            <FilePlus size={20} className="text-sage-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Create Request</span>
        </Link>
      </div>

      {/* Recent available donations */}
      <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Latest Available</h2>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}</div>
      ) : recentDonations.length === 0 ? (
        <div className="card text-center py-10">
          <Gift size={36} className="text-gray-200 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No donations available right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentDonations.map(d => (
            <div key={d._id} className="card flex items-center gap-4">
              {d.image ? (
                <img src={`/uploads/${d.image}`} alt={d.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <Gift size={22} className="text-brand-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{d.name}</p>
                <p className="text-xs text-gray-500">Qty: {d.quantity}</p>
                <p className="text-xs text-gray-400">By: {d.donorId?.name}</p>
              </div>
              <Link to="/acceptor/donations" className="text-xs text-brand-500 font-semibold hover:underline flex-shrink-0">
                Accept →
              </Link>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default AcceptorDashboard;
