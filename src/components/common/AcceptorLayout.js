import React from 'react';
import { Outlet } from 'react-router-dom';
import { AcceptorSidebar } from './Sidebar';
import DonifyBot from './DonifyBot';

const AcceptorLayout = () => (
  <div className="min-h-screen bg-app">
    <AcceptorSidebar />
    <main>
      <Outlet />
    </main>
    {/* Bot — எல்லா acceptor pages-லயும் static-ஆ இருக்கும் */}
    <DonifyBot />
  </div>
);

export default AcceptorLayout;