import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import toast from 'react-hot-toast';
import { Building2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const PendingAcceptors = () => {
  const [acceptors, setAcceptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchAcceptors = async () => {
    try {
      const { data } = await API.get('/admin/pending');
      setAcceptors(data);
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAcceptors(); }, []);

  const handleApprove = async (id) => {
    setActionId(id + '_approve');
    try {
      await API.put(`/admin/approve/${id}`);
      toast.success('Organization approved!');
      fetchAcceptors();
    } catch (err) {
      toast.error('Failed to approve');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject and remove this applicant?')) return;
    setActionId(id + '_reject');
    try {
      await API.put(`/admin/reject/${id}`);
      toast.success('Applicant rejected');
      fetchAcceptors();
    } catch (err) {
      toast.error('Failed to reject');
    } finally {
      setActionId(null);
    }
  };

  return (
    <PageWrapper title="Pending Approvals" subtitle={`${acceptors.length} organization(s) waiting`}>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-32 animate-pulse bg-gray-100" />)}</div>
      ) : acceptors.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle size={48} className="text-green-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">All clear! No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptors.map(a => (
            <div key={a._id} className="card">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-sage-600" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{a.organizationName || a.name}</h3>
                  <p className="text-sm text-gray-500">{a.email}</p>
                  {a.phone && <p className="text-sm text-gray-500">{a.phone}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    Applied: {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {/* Proof image */}
                  {a.proofImage && (
                    <a
                      href={`/uploads/${a.proofImage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-500 hover:underline font-medium"
                    >
                      <ExternalLink size={12} /> View Proof Document
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleApprove(a._id)}
                  disabled={actionId !== null}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {actionId === a._id + '_approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(a._id)}
                  disabled={actionId !== null}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  {actionId === a._id + '_reject' ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default PendingAcceptors;
