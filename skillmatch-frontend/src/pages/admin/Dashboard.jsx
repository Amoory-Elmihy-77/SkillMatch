import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Users, Briefcase, Clock, AlertCircle, TrendingUp, BarChart2, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserAvatarUrl } from '../../utils/avatar';
import Loader from '../../components/Loader';
import logo from '../../assets/logo.png';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOpportunities: 0,
    pendingApprovals: 0,
    flaggedReports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats({
        totalUsers: response.data.data.totalActiveUsers || 0,
        activeOpportunities: response.data.data.totalOpportunities || 0,
        pendingApprovals: 78, // Mock data
        flaggedReports: 12    // Mock data
      });
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <Loader />;

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col min-h-full">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SkillMatch Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-primary-600">SkillMatch</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            Users Management
          </Link>
          <Link to="/admin/opportunities" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Briefcase className="w-5 h-5" />
            Opportunities
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <BarChart2 className="w-5 h-5" />
            Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-4">
            <img 
              src={getUserAvatarUrl(user)} 
              alt="Admin" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">Admin User</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Key metrics and insights for SkillMatch platform activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Increased by 12% this month
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Active Opportunities</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.activeOpportunities.toLocaleString()}</h3>
            <p className="text-xs text-gray-500 mt-2">50 new opportunities this week</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</h3>
            <p className="text-xs text-gray-500 mt-2">New users and opportunities</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Flagged Reports</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.flaggedReports}</h3>
            <p className="text-xs text-gray-500 mt-2">Review required for content</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">User Growth Over Time</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[30, 45, 55, 60, 75, 85, 95].map((h, i) => (
                <div key={i} className="w-full bg-primary-100 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-primary-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Opportunity Engagement</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
               {[60, 80, 45, 55, 30].map((h, i) => (
                <div key={i} className="w-full flex flex-col justify-end gap-1">
                  <div className="w-full bg-yellow-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  <div className="w-full bg-red-400 rounded-t-sm" style={{ height: `${h * 0.2}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400">
              <span>Design</span><span>Dev</span><span>Marketing</span><span>Writing</span><span>Video</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
