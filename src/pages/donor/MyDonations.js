import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Gift, PlusCircle, XCircle } from 'lucide-react';

const statusStyle = {
  available: 'bg-sage-100 text-sage-700',
  accepted: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchDonations = async () => {
    try {
      const { data } = await API.get('/donations/my');
      setDonations(data);
    } catch (err) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    setCancelling(id);
    try {
      await API.put(`/donations/${id}/cancel`);
      toast.success('Donation cancelled');
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <PageWrapper
      title="My Donations"
      subtitle={`${donations.length} total donations`}
      action={
        <Link to="/donor/create" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle size={16} /> New
        </Link>
      }
    >
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="card h-24 animate-pulse bg-gray-100" />)}
        </div>
      ) : donations.length === 0 ? (
        <div className="card text-center py-16">
          <Gift size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No donations yet</p>
          <Link to="/donor/create" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
            <PlusCircle size={16} /> Create First Donation
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d._id} className={`card flex gap-4 ${d.status === 'accepted' ? 'relative overflow-hidden' : ''}`}>
              {/* Image */}
              <div className="relative flex-shrink-0">
                {d.image ? (
                  <img
                    src={`/uploads/${d.image}`}
                    alt={d.name}
                    className={`w-16 h-16 rounded-xl object-cover ${d.status === 'accepted' ? 'blur-sm' : ''}`}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Gift size={24} className="text-brand-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {d.quantity}</p>
                    {d.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{d.description}</p>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusStyle[d.status]}`}>
                    {d.status}
                  </span>
                </div>

                {/* Accepted info */}
                {d.status === 'accepted' && d.acceptedBy && (
                  <div className="mt-2 flex items-center gap-1.5 bg-green-50 rounded-lg px-2.5 py-1.5">
                    <span className="text-xs text-green-700 font-medium">
                      Taken by @{d.acceptedBy.organizationName || d.acceptedBy.name}
                    </span>
                  </div>
                )}

                {/* Cancel button */}
                {d.status === 'available' && (
                  <button
                    onClick={() => handleCancel(d._id)}
                    disabled={cancelling === d._id}
                    className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    <XCircle size={14} />
                    {cancelling === d._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default MyDonations;
