import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
            <button type="submit" disabled={loading} className="btn-primary mt-2">
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