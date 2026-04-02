import React from 'react';
import { Outlet } from 'react-router-dom';
import { DonorSidebar } from './Sidebar';

const DonorLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <DonorSidebar />
    <main>
      <Outlet />
    </main>
  </div>
);

export default DonorLayout;
