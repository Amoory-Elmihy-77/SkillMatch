import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, MapPin, Briefcase } from 'lucide-react';
import api from '../services/api';
import { getUserAvatarUrl } from '../utils/avatar';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const DiscoverUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/discover');
      setUsers(response.data.users || response.data.data?.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Discover Users
          </h1>
          <p className="text-gray-600 mt-2">Connect with professionals in your field</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No users found' : 'No users to suggest'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Check back later for new users to connect with'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-24 bg-gradient-to-r from-primary-500 to-purple-600"></div>
                <div className="p-6 -mt-12">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={getUserAvatarUrl(user)}
                      alt={user.name}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">@{user.username}</p>
                    
                    {user.title && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.title}</span>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}

                    {user.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    {user.skills && user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {user.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{user.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/profile/${user._id}`}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverUsers;
