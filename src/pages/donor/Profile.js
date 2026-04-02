import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { User, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    API.get('/profile').then(({ data }) => {
      setForm({ name: data.name || '', phone: data.phone || '' });
    }).finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/profile', form);
      updateUser({ name: form.name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageWrapper><div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="card h-14 bg-gray-100" />)}</div></PageWrapper>;

  return (
    <PageWrapper title="Edit Profile" subtitle="Update your personal details">
      <div className="card max-w-lg mx-auto">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-3xl shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Role badge */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold capitalize">
            {user?.role}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input className="input-field" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input className="input-field bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input className="input-field" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
