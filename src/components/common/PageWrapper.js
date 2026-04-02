import React from 'react';

const PageWrapper = ({ title, subtitle, children, action }) => (
  <div className="pt-16 px-4 pb-8 max-w-5xl mx-auto">
    {(title || action) && (
      <div className="flex items-start justify-between mb-6">
        <div>
          {title && <h1 className="page-title">{title}</h1>}
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

export default PageWrapper;
