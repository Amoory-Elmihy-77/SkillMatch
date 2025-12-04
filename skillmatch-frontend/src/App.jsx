import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import DiscoverUsers from './pages/DiscoverUsers';
import Opportunities from './pages/Opportunities';
import Recommended from './pages/Recommended';
import SavedOpportunities from './pages/SavedOpportunities';
import OpportunityDetails from './pages/OpportunityDetails';
import Connections from './pages/Connections';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOpportunities from './pages/admin/Opportunities';
import AdminApplications from './pages/admin/Applications';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerOpportunities from './pages/manager/Opportunities';
import ManagerApplications from './pages/manager/Applications';
import ProtectedRoute from './components/ProtectedRoute';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

function App() {
  return (
    <Router>
      <SocketProvider>
        <NotificationsProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/opportunities/:id" element={<OpportunityDetails />} />

                {/* Protected Routes */}
                <Route
                  path="/me"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/me/saved"
                  element={
                    <ProtectedRoute>
                      <SavedOpportunities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/connections"
                  element={
                    <ProtectedRoute>
                      <Connections />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/discover"
                  element={
                    <ProtectedRoute>
                      <DiscoverUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommended"
                  element={
                    <ProtectedRoute>
                      <Recommended />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Manager Routes */}
                <Route
                  path="/manager/dashboard"
                  element={
                    <ProtectedRoute managerOnly>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/opportunities"
                  element={
                    <ProtectedRoute managerOnly>
                      <ManagerOpportunities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/applications"
                  element={
                    <ProtectedRoute managerOnly>
                      <ManagerApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/opportunities"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminOpportunities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationsProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
