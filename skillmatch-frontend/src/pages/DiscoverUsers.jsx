import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, MapPin, Briefcase } from "lucide-react";
import api from "../services/api";
import { getUserAvatarUrl } from "../utils/avatar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const DiscoverUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/auth/discover?page=${pageNumber}&limit=${limit}`
      );

      const { users, totalPages } = response.data;

      setUsers((prev) => (pageNumber === 1 ? users : [...prev, ...users]));
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Discover Users
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with professionals in your field
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Content */}
        {filteredUsers.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">
              {searchQuery ? "No users found" : "No users to suggest"}
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition"
                >
                  <div className="h-24 bg-gradient-to-r from-primary-500 to-purple-600" />
                  <div className="p-6 -mt-12 text-center">
                    <img
                      src={getUserAvatarUrl(user)}
                      alt={user.name}
                      className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-4"
                    />

                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      @{user.username}
                    </p>

                    {user.title && (
                      <div className="flex justify-center items-center gap-1 text-sm mb-2">
                        <Briefcase className="w-4 h-4" />
                        {user.title}
                      </div>
                    )}

                    {user.location && (
                      <div className="flex justify-center items-center gap-1 text-sm mb-4">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                    )}

                    <Link
                      to={`/profile/${user._id}`}
                      className="block w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => fetchUsers(page + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="flex justify-center mt-6">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverUsers;
