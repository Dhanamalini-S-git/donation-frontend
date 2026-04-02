import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { Gift, Upload } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('donor');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', organizationName: '' });
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      fd.append('role', role);
      if (proofFile) fd.append('proofImage', proofFile);

      const { data } = await API.post('/auth/register', fd);
      toast.success('OTP sent! Check console/email');
      navigate('/verify-otp', { state: { userId: data.userId, email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Gift size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join DonateConnect</p>
        </div>

        {/* Role selector */}
        <div className="flex gap-2 mb-4 bg-white p-1 rounded-xl border border-gray-200">
          {['donor', 'acceptor'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                role === r ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r === 'acceptor' ? 'Organization' : 'Donor'}
            </button>
          ))}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-3">
            {role === 'acceptor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
                <input className="input-field" placeholder="NGO / Charity name"
                  value={form.organizationName}
                  onChange={e => setForm({ ...form, organizationName: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className="input-field" placeholder="Your name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input className="input-field" placeholder="+91 9876543210"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            {role === 'acceptor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Proof Document / Image</label>
                <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-brand-300 transition-colors">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{proofFile ? proofFile.name : 'Upload proof image'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setProofFile(e.target.files[0])} />
                </label>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
