import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MoreVertical, X, Home, PlusCircle, List, Bell, User,
  Gift, Search, FileText, FilePlus, Clock, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Sidebar = ({ navItems, role }) => {
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 w-10 h-10 bg-[#1a1d27] rounded-xl border border-white/10 flex items-center justify-center hover:border-violet-500/40 hover:text-violet-400 transition-all duration-200 text-white/60">
        <MoreVertical size={18} />
      </button>

      <button onClick={() => setShowNotifications(!showNotifications)}
        className="fixed right-4 top-4 z-40 w-10 h-10 bg-[#1a1d27] rounded-xl border border-white/10 flex items-center justify-center hover:border-violet-500/40 hover:text-violet-400 transition-all duration-200 text-white/60 relative">
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setOpen(false)} />}

      <div ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-72 bg-[#13151f] z-50 flex flex-col transition-transform duration-300 ease-in-out border-r border-white/8 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Donify</p>
              <p className="text-xs text-white/30 capitalize">{role} Portal</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/8 flex items-center justify-center transition-colors text-white/40 hover:text-white/70">
            <X size={15} />
          </button>
        </div>

        <div className="mx-3 mt-3 p-3 bg-white/5 rounded-xl border border-white/8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{user?.name}</p>
            <p className="text-xs text-white/30 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="flex-shrink-0 opacity-70">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={13} className="opacity-20" />
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/8">
          <button onClick={() => { logout(); navigate('/login'); }}
            className="sidebar-link w-full text-red-400/70 hover:bg-red-500/10 hover:text-red-400 border-0">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <NotificationPanel open={showNotifications} onClose={() => setShowNotifications(false)} onUnreadCount={setUnreadCount} />
    </>
  );
};

export const DonorSidebar = () => (
  <Sidebar role="donor" navItems={[
    { path: '/donor', exact: true, icon: <Home size={16} />, label: 'Dashboard' },
    { path: '/donor/create', icon: <PlusCircle size={16} />, label: 'Create Donation' },
    { path: '/donor/my-donations', icon: <List size={16} />, label: 'My Donations' },
    { path: '/donor/requests', icon: <FileText size={16} />, label: 'View Requests' },
    { path: '/donor/profile', icon: <User size={16} />, label: 'Profile' },
  ]} />
);

export const AcceptorSidebar = () => (
  <Sidebar role="acceptor" navItems={[
    { path: '/acceptor', exact: true, icon: <Home size={16} />, label: 'Dashboard' },
    { path: '/acceptor/donations', icon: <Search size={16} />, label: 'Browse Donations' },
    { path: '/acceptor/requests', icon: <List size={16} />, label: 'My Requests' },
    { path: '/acceptor/create-request', icon: <FilePlus size={16} />, label: 'Create Request' },
    { path: '/acceptor/profile', icon: <User size={16} />, label: 'Profile' },
  ]} />
);

export const AdminSidebar = () => (
  <Sidebar role="admin" navItems={[
    { path: '/admin', exact: true, icon: <Home size={16} />, label: 'Dashboard' },
    { path: '/admin/pending', icon: <Clock size={16} />, label: 'Pending Approvals' },
    { path: '/admin/profile', icon: <User size={16} />, label: 'Profile' },
  ]} />
);

export default Sidebar;