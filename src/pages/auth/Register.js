import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload, Sparkles, Building2, User, MapPin } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('donor');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', organizationName: '',
    address: '', city: '', state: '', pincode: ''
  });
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      fd.append('role', role);
      // Location object as JSON string
      fd.append('location', JSON.stringify({
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode
      }));
      if (proofFile) fd.append('proofImage', proofFile);
      const { data } = await API.post('/auth/register', fd);
      toast.success('OTP sent! Check server console.');
      navigate('/verify-otp', { state: { userId: data.userId, email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const InputField = ({ label, field, type = 'text', placeholder, required = false }) => (
    <div>
      <label className="block mb-2">{label}</label>
      <input type={type} className="input-field" placeholder={placeholder}
        value={form[field]} onChange={set(field)} required={required} />
    </div>
  );

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}} />
      </div>

      <div className="w-full max-w-sm relative py-8">
        {/* Logo */}
        <div className="text-center mb-6 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow mb-3 animate-pulse-ring">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
          <p className="text-white/40 text-sm mt-1">Join Donify today</p>
        </div>

        {/* Role selector */}
        <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-xl border border-white/8 animate-fade-up stagger-1">
          {[
            { key: 'donor', label: 'Donor', icon: <User size={14}/> },
            { key: 'acceptor', label: 'Organization', icon: <Building2 size={14}/> }
          ].map(r => (
            <button key={r.key} type="button" onClick={() => setRole(r.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === r.key
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              {r.icon}{r.label}
            </button>
          ))}
        </div>

        <div className="card animate-fade-up stagger-2">
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Organization name — acceptor only */}
            {role === 'acceptor' && (
              <InputField label="Organization Name" field="organizationName"
                placeholder="NGO / Charity name" required />
            )}

            <InputField label="Full Name" field="name" placeholder="Your name" required />
            <InputField label="Email" field="email" type="email" placeholder="you@example.com" required />
            <InputField label="Phone" field="phone" placeholder="+91 9876543210" />
            <InputField label="Password" field="password" type="password" placeholder="••••••••" required />

            {/* Location Section */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-violet-400" />
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Location</span>
              </div>
              <div className="space-y-3 pl-1 border-l-2 border-violet-500/20 ml-1 pl-4">
                <div>
                  <label className="block mb-2">Address</label>
                  <input className="input-field" placeholder="Street / Area"
                    value={form.address} onChange={set('address')} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-2">City</label>
                    <input className="input-field" placeholder="Chennai"
                      value={form.city} onChange={set('city')} />
                  </div>
                  <div>
                    <label className="block mb-2">Pincode</label>
                    <input className="input-field" placeholder="600001"
                      maxLength={6} value={form.pincode} onChange={set('pincode')} />
                  </div>
                </div>
                <div>
                  <label className="block mb-2">State</label>
                  <select className="input-field" value={form.state} onChange={set('state')}>
                    <option value="" style={{background:'#1a1d27'}}>Select State</option>
                    {[
                      'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
                      'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
                      'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
                      'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
                      'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
                      'Delhi','Jammu & Kashmir','Ladakh','Puducherry'
                    ].map(s => (
                      <option key={s} value={s} style={{background:'#1a1d27'}}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Proof document — acceptor only */}
            {role === 'acceptor' && (
              <div>
                <label className="block mb-2">Proof Document</label>
                <label className="flex items-center gap-3 border border-dashed border-white/15 rounded-xl p-3 cursor-pointer hover:border-violet-500/40 transition-all group">
                  <Upload size={16} className="text-white/30 group-hover:text-violet-400 transition-colors" />
                  <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors">
                    {proofFile ? proofFile.name : 'Upload proof image'}
                  </span>
                  <input type="file" className="hidden" accept="image/*"
                    onChange={e => setProofFile(e.target.files[0])} />
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