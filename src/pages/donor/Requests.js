import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { FileText, Building2 } from 'lucide-react';

const DonorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/requests').then(({ data }) => setRequests(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Donation Requests" subtitle="Organizations looking for donations">
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No requests yet</p>
          <p className="text-gray-400 text-sm mt-1">Organizations will post their needs here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r._id} className="card flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-sage-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {r.acceptorId?.organizationName || r.acceptorId?.name}
                </p>
                <p className="text-gray-600 text-sm mt-1">{r.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sage-100 text-sage-700 font-medium h-fit flex-shrink-0">
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default DonorRequests;
