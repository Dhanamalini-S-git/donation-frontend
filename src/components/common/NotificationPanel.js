import React, { useEffect, useState } from 'react';
import { X, Bell, Check } from 'lucide-react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const NotificationPanel = ({ open, onClose, onUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/notifications');
      setNotifications(data);
      const unread = data.filter(n => !n.read).length;
      onUnreadCount(unread);
    } catch (err) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onUnreadCount(0);
    } catch (err) {
      toast.error('Failed to mark notifications');
    }
  };

  const typeColor = {
    donation: 'bg-brand-100 text-brand-600',
    request: 'bg-sage-100 text-sage-600',
    approval: 'bg-green-100 text-green-600',
    general: 'bg-gray-100 text-gray-600',
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed right-4 top-16 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-brand-500" />
            <span className="font-semibold text-gray-900 text-sm">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-xs text-brand-500 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              <Check size={12} /> Mark all read
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 border-b border-gray-50 transition-colors ${!n.read ? 'bg-brand-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${typeColor[n.type] || typeColor.general}`}>
                    {n.type}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
