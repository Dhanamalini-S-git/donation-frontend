import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  MoreVertical, X, Home, PlusCircle, List, Bell, User,
  Gift, Search, FileText, FilePlus, ShieldCheck, Clock,
  LogOut, Pencil, ChevronRight
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Sidebar = ({ navItems, role }) => {
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* 3-dots trigger button - fixed on left side, visible on all pages */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 w-10 h-10 bg-white rounded-xl shadow-card border border-gray-100 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition-all duration-200"
        aria-label="Open menu"
      >
        <MoreVertical size={20} className="text-gray-600" />
      </button>

      {/* Notification bell - fixed top right */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed right-4 top-4 z-40 w-10 h-10 bg-white rounded-xl shadow-card border border-gray-100 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition-all duration-200 relative"
      >
        <Bell size={18} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-sidebar flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Gift size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-gray-900 text-sm leading-tight">DonateConnect</p>
              <p className="text-xs text-gray-400 capitalize">{role} Portal</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 mx-3 mt-3 bg-brand-50 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {/* Show pencil icon next to "Edit Profile" */}
              {item.isEdit && <Pencil size={14} className="opacity-60" />}
              {!item.isEdit && <ChevronRight size={14} className="opacity-30" />}
            </NavLink>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCount={setUnreadCount}
      />
    </>
  );
};

// Pre-built sidebars per role
export const DonorSidebar = () => (
  <Sidebar
    role="donor"
    navItems={[
      { path: '/donor', exact: true, icon: <Home size={18} />, label: 'Dashboard' },
      { path: '/donor/create', icon: <PlusCircle size={18} />, label: 'Create Donation' },
      { path: '/donor/my-donations', icon: <List size={18} />, label: 'My Donations' },
      { path: '/donor/requests', icon: <FileText size={18} />, label: 'View Requests' },
      { path: '/donor/profile', icon: <User size={18} />, label: 'Edit Profile', isEdit: true },
    ]}
  />
);

export const AcceptorSidebar = () => (
  <Sidebar
    role="acceptor"
    navItems={[
      { path: '/acceptor', exact: true, icon: <Home size={18} />, label: 'Dashboard' },
      { path: '/acceptor/donations', icon: <Search size={18} />, label: 'Browse Donations' },
      { path: '/acceptor/requests', icon: <List size={18} />, label: 'My Requests' },
      { path: '/acceptor/create-request', icon: <FilePlus size={18} />, label: 'Create Request' },
      { path: '/acceptor/profile', icon: <User size={18} />, label: 'Edit Profile', isEdit: true },
    ]}
  />
);

export const AdminSidebar = () => (
  <Sidebar
    role="admin"
    navItems={[
      { path: '/admin', exact: true, icon: <Home size={18} />, label: 'Dashboard' },
      { path: '/admin/pending', icon: <Clock size={18} />, label: 'Pending Approvals' },
      { path: '/admin/profile', icon: <User size={18} />, label: 'Edit Profile', isEdit: true },
    ]}
  />
);

export default Sidebar;
