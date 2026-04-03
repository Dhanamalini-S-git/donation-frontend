import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DASHBOARD_PATHS = ['/donor', '/acceptor', '/admin'];

const PageWrapper = ({ title, subtitle, children, action }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = DASHBOARD_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-app pb-12">
      {/* Top bar */}
      <div className="sticky top-0 z-30 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(to bottom, #0d0f18 85%, transparent)' }}>

        {/* Back button — dashboard-ல் இல்ல, மற்ற எல்லா pages-லயும் */}
        {!isDashboard ? (
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-violet-500/15 hover:border-violet-500/40 transition-all flex-shrink-0 active:scale-90">
            <ArrowLeft size={17} />
          </button>
        ) : (
          <div className="w-10 flex-shrink-0" /> 
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <h1 className="font-display font-bold text-white text-lg leading-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-white/35 text-xs mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Full width content */}
      <div className="px-4 animate-fade-up stagger-1">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;