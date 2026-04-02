import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import PageWrapper from '../../components/common/PageWrapper';
import { FileText, FilePlus } from 'lucide-react';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/requests/my').then(({ data }) => setRequests(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    open: 'bg-brand-100 text-brand-700',
    fulfilled: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  return (
    <PageWrapper
      title="My Requests"
      subtitle={`${requests.length} total requests`}
      action={
        <Link to="/acceptor/create-request" className="btn-primary flex items-center gap-2 text-sm">
          <FilePlus size={16} /> New
        </Link>
      }
    >
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}</div>
      ) : requests.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No requests yet</p>
          <Link to="/acceptor/create-request" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
            <FilePlus size={16} /> Create First Request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r._id} className="card">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-700 flex-1 leading-relaxed">{r.message}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusStyle[r.status]}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default MyRequests;
