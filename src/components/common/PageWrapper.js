import React from 'react';

const PageWrapper = ({ title, subtitle, children, action }) => (
  <div className="min-h-screen bg-app pb-8">
    <div className="max-w-lg mx-auto px-4 pt-16">
      <div className="mb-6 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-white/40 text-sm mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div className="animate-fade-up stagger-1">{children}</div>
    </div>
  </div>
);

export default PageWrapper;