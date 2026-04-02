import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email } = location.state || {};

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { userId, otp: code });
      if (data.waitingApproval) {
        toast.success('OTP verified! Waiting for admin approval.');
        navigate('/login');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Account verified!');
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sage-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-1">Enter the 6-digit code sent to<br /><span className="font-medium text-gray-700">{email}</span></p>
          <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-1.5 inline-block">Check server console for OTP (dev mode)</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => refs.current[i] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                />
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
