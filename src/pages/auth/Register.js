import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload, Sparkles, Building2, User } from 'lucide-react';

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
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { userId: data.userId, email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}} />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-6 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow mb-3 animate-pulse-ring">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
          <p className="text-white/40 text-sm mt-1">Join Donify today</p>
        </div>

        <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-xl border border-white/8 animate-fade-up stagger-1">
          {[
            { key: 'donor', label: 'Donor', icon: <User size={14}/> },
            { key: 'acceptor', label: 'Organization', icon: <Building2 size={14}/> }
          ].map(r => (
            <button key={r.key} type="button" onClick={() => setRole(r.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === r.key
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              {r.icon}{r.label}
            </button>
          ))}
        </div>

        <div className="card animate-fade-up stagger-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            {role === 'acceptor' && (
              <div>
                <label className="block mb-2">Organization Name</label>
                <input className="input-field" placeholder="NGO / Charity name"
                  value={form.organizationName}
                  onChange={e => setForm({ ...form, organizationName: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="block mb-2">Full Name</label>
              <input className="input-field" placeholder="Your name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block mb-2">Phone</label>
              <input className="input-field" placeholder="+91 9876543210"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            {role === 'acceptor' && (
              <div>
                <label className="block mb-2">Proof Document</label>
                <label className="flex items-center gap-3 border border-dashed border-white/15 rounded-xl p-3 cursor-pointer hover:border-violet-500/40 transition-all group">
                  <Upload size={16} className="text-white/30 group-hover:text-violet-400 transition-colors" />
                  <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors">
                    {proofFile ? proofFile.name : 'Upload proof image'}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setProofFile(e.target.files[0])} />
                </label>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Creating...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;