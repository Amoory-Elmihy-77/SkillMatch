import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, Search, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getUserAvatarUrl } from '../utils/avatar';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Connections = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const response = await api.get('/connections/pending');
        setPendingRequests(response.data.connections || []);
      } else {
        const response = await api.get('/connections');
        setConnections(response.data.connections || []);
      }
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.post(`/connections/${requestId}/accept`);
      toast.success('Connection request accepted!');
      fetchData();
    } catch (error) {
      console.error('Failed to accept connection:', error);
      toast.error('Failed to accept connection');
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.post(`/connections/${requestId}/reject`);
      toast.success('Connection request rejected');
      fetchData();
    } catch (error) {
      console.error('Failed to reject connection:', error);
      toast.error('Failed to reject connection');
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const filteredConnections = connections.filter(conn =>
    conn.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Connections
          </h1>
          <p className="text-gray-600 mt-2">Manage your professional network</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending Requests
                  {pendingRequests.length > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
                      {pendingRequests.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'connections'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  My Connections
                  {connections.length > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-gray-600 text-white rounded-full">
                      {connections.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'connections' && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : activeTab === 'pending' ? (
              pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-500">You don't have any pending connection requests</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getUserAvatarUrl(request.sender)}
                          alt={request.sender?.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.sender?.name}</h3>
                          <p className="text-sm text-gray-500">@{request.sender?.username}</p>
                          {request.sender?.bio && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{request.sender.bio}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(request._id)}
                          disabled={processing[request._id]}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={processing[request._id]}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : filteredConnections.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No connections found' : 'No connections yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Start connecting with other users to build your network'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredConnections.map((connection) => (
                  <Link
                    key={connection._id}
                    to={`/profile/${connection._id}`}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={getUserAvatarUrl(connection)}
                        alt={connection.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mb-3"
                      />
                      <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-500">@{connection.username}</p>
                      {connection.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{connection.bio}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;
