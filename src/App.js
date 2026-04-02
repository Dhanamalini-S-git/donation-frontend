import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';

// Layouts with sidebar
import DonorLayout from './components/common/DonorLayout';
import AcceptorLayout from './components/common/AcceptorLayout';
import AdminLayout from './components/common/AdminLayout';

// Donor pages
import DonorDashboard from './pages/donor/Dashboard';
import CreateDonation from './pages/donor/CreateDonation';
import MyDonations from './pages/donor/MyDonations';
import DonorRequests from './pages/donor/Requests';
import DonorProfile from './pages/donor/Profile';

// Acceptor pages
import AcceptorDashboard from './pages/acceptor/Dashboard';
import BrowseDonations from './pages/acceptor/BrowseDonations';
import MyRequests from './pages/acceptor/MyRequests';
import CreateRequest from './pages/acceptor/CreateRequest';
import AcceptorProfile from './pages/acceptor/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import PendingAcceptors from './pages/admin/PendingAcceptors';
import AdminProfile from './pages/admin/Profile';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* Donor */}
      <Route path="/donor" element={<ProtectedRoute allowedRoles={['donor']}><DonorLayout /></ProtectedRoute>}>
        <Route index element={<DonorDashboard />} />
        <Route path="create" element={<CreateDonation />} />
        <Route path="my-donations" element={<MyDonations />} />
        <Route path="requests" element={<DonorRequests />} />
        <Route path="profile" element={<DonorProfile />} />
      </Route>

      {/* Acceptor */}
      <Route path="/acceptor" element={<ProtectedRoute allowedRoles={['acceptor']}><AcceptorLayout /></ProtectedRoute>}>
        <Route index element={<AcceptorDashboard />} />
        <Route path="donations" element={<BrowseDonations />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="create-request" element={<CreateRequest />} />
        <Route path="profile" element={<AcceptorProfile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="pending" element={<PendingAcceptors />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: "'DM Sans', sans-serif", borderRadius: '12px', fontSize: '14px' } }} />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
