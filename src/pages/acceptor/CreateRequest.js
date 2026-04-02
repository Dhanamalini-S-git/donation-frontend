import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import toast from 'react-hot-toast';
import { Send, CheckCircle } from 'lucide-react';

const CreateRequest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error('Please describe what you need');
    setLoading(true);
    try {
      await API.post('/requests', { message });
      setSuccess(true);
      setTimeout(() => navigate('/acceptor/requests'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-gray-500 text-sm">All donors have been notified of your request.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Create Request" subtitle="Tell donors what your organization needs">
      <div className="card max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">What do you need?</label>
            <textarea
              className="input-field resize-none"
              rows={5}
              placeholder="e.g. We urgently need 50 food kits for flood victims in our district. Dry food items, clothes size M/L, and water bottles would be greatly appreciated."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400 mt-1">{message.length} characters — be specific to get better responses</p>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">📢 This request will be sent to all registered donors as a notification.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <Send size={16} />
            {loading ? 'Sending...' : 'Send Request to Donors'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default CreateRequest;
