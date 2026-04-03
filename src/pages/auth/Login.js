import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

// ─── Forgot Password Flow ───────────────────────────────
const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1=email, 2=otp+newpass
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const refs = React.useRef([]);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i+1]?.focus();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setUserId(data.userId);
      toast.success('OTP sent! Check server console.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match!');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await API.post('/auth/reset-password', {
        userId, otp: otp.join(''), newPassword
      });
      toast.success('Password reset successfully!');
      onBack();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-float"/>
      </div>
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8 animate-fade-up">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-pulse-ring ${
            step === 1
              ? 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600'
          }`}>
            {step === 1 ? <KeyRound size={28} className="text-white"/> : <ShieldCheck size={28} className="text-white"/>}
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {step === 1 ? 'Enter your email to receive OTP' : `OTP sent to ${email}`}
          </p>
        </div>

        <div className="card animate-fade-up stagger-1">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block mb-2">Email Address</label>
                <input type="email" className="input-field" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>Sending OTP...
                  </span>
                ) : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {/* OTP boxes */}
              <div>
                <label className="block mb-2">Enter OTP</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input key={i} ref={el => refs.current[i] = el}
                      type="text" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => { if (e.key==='Backspace' && !otp[i] && i>0) refs.current[i-1]?.focus(); }}
                      className={`w-10 h-12 text-center text-lg font-bold rounded-xl border-2 bg-white/5 text-white transition-all focus:outline-none focus:scale-105 ${
                        digit ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 focus:border-violet-500/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2">New Password</label>
                <input type="password" className="input-field" placeholder="Min 6 characters"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2">Confirm Password</label>
                <input type="password" className="input-field" placeholder="Re-enter password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>Resetting...
                  </span>
                ) : 'Reset Password'}
              </button>
            </form>
          )}

          <button onClick={onBack}
            className="flex items-center justify-center gap-2 w-full mt-4 text-sm text-white/40 hover:text-violet-400 transition-colors">
            <ArrowLeft size={14}/> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Login ──────────────────────────────────────────
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (showForgot) return <ForgotPassword onBack={() => setShowForgot(false)} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-float"/>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}}/>
      </div>
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow mb-4 animate-pulse-ring">
            <Sparkles size={28} className="text-white"/>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Donify</h1>
          <p className="text-white/40 text-sm">Sign in to your account</p>
        </div>

        <div className="card animate-fade-up stagger-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <div className="relative">
                <input type={showPw?'text':'password'} className="input-field pr-11" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required/>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowForgot(true)}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;