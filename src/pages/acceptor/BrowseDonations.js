import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import toast from 'react-hot-toast';
import { Gift, CheckCircle } from 'lucide-react';

const BrowseDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  const fetchDonations = async () => {
    try {
      const { data } = await API.get('/donations');
      setDonations(data);
    } catch (err) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleAccept = async (id) => {
    if (!window.confirm('Accept this donation?')) return;
    setAccepting(id);
    try {
      await API.put(`/donations/${id}/accept`);
      toast.success('Donation accepted! Donor has been notified.');
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    } finally {
      setAccepting(null);
    }
  };

  return (
    <PageWrapper
      title="Browse Donations"
      subtitle={`${donations.length} available donations`}
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="card h-48 animate-pulse bg-gray-100" />)}
        </div>
      ) : donations.length === 0 ? (
        <div className="card text-center py-16">
          <Gift size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No donations available right now</p>
          <p className="text-gray-400 text-sm mt-1">Check back later or encourage donors to contribute</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {donations.map(d => (
            <div key={d._id} className="card flex flex-col gap-3 hover:shadow-md transition-shadow">
              {d.image ? (
                <img src={`/uploads/${d.image}`} alt={d.name} className="w-full h-40 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-40 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <Gift size={36} className="text-brand-300" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{d.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Quantity: {d.quantity}</p>
                {d.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{d.description}</p>}
                <p className="text-xs text-gray-400 mt-1">By: {d.donorId?.name}</p>
              </div>
              <button
                onClick={() => handleAccept(d._id)}
                disabled={accepting === d._id}
                className="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle size={16} />
                {accepting === d._id ? 'Accepting...' : 'Accept Donation'}
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default BrowseDonations;
