import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import toast from 'react-hot-toast';
import { Upload, CheckCircle, X } from 'lucide-react';

const CreateDonation = () => {
  const [form, setForm] = useState({ name: '', quantity: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => { setImage(null); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await API.post('/donations', fd);
      setSuccess(true);
      setTimeout(() => navigate('/donor/my-donations'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create donation');
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
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Donation Created!</h2>
          <p className="text-gray-500 text-sm">Your donation has been listed. Redirecting...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Create Donation" subtitle="Share what you'd like to donate">
      <div className="card max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Photo</label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                <button type="button" onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-all">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload photo</span>
                <span className="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name *</label>
            <input className="input-field" placeholder="e.g. Rice Bag, Winter Clothes..."
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity *</label>
            <input className="input-field" placeholder="e.g. 5 kg, 10 pieces, 2 boxes..."
              value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={3}
              placeholder="Describe the condition, any relevant details..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Donation'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default CreateDonation;
