import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const refs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email } = location.state || {};

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) { setOtp(paste.split('')); refs.current[5]?.focus(); }
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
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await API.post('/auth/resend-otp', { userId });
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally { setResending(false); }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-float" />
      </div>
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-4 animate-pulse-ring">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Verify Email</h1>
          <p className="text-white/40 text-sm mt-2">
            OTP sent to<br />
            <span className="text-violet-400 font-medium">{email}</span>
          </p>
        </div>

        <div className="card animate-fade-up stagger-1">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => refs.current[i] = el}
                  type="text" maxLength={1} value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`w-11 text-center text-xl font-bold rounded-xl border-2 bg-white/5 text-white transition-all duration-200 focus:outline-none focus:scale-110 ${
                    digit ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 focus:border-violet-500/60'
                  }`}
                  style={{height:'52px'}}
                />
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Verifying...
                </span>
              ) : 'Verify OTP'}
            </button>
          </form>
          <button onClick={handleResend} disabled={resending}
            className="flex items-center justify-center gap-2 w-full mt-3 text-sm text-white/40 hover:text-violet-400 transition-colors">
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default VerifyOTP;