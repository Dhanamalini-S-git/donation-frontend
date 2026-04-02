import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './Sidebar';

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <AdminSidebar />
    <main>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
