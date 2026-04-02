import React from 'react';
import { Outlet } from 'react-router-dom';
import { AcceptorSidebar } from './Sidebar';

const AcceptorLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <AcceptorSidebar />
    <main>
      <Outlet />
    </main>
  </div>
);

export default AcceptorLayout;
