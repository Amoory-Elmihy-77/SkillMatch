import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Briefcase, Mail, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserAvatarUrl } from "../utils/avatar";
import ConnectionButton from "../components/ConnectionButton";
import api from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/auth/${userId}`);
      setProfileUser(response.data.data?.user || response.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User not found
          </h2>
          <p className="text-gray-600 mb-4">
            The user you're looking for doesn't exist
          </p>
          <Link
            to="/discover"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-purple-600 relative">
            {isOwnProfile && (
              <Link
                to="/me"
                className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                  <img
                    src={getUserAvatarUrl(profileUser)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {!isOwnProfile && <ConnectionButton userId={userId} />}
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileUser.name}
              </h1>
              <p className="text-gray-600">@{profileUser.username}</p>
              {profileUser.title && (
                <p className="text-lg text-gray-700 mt-1">
                  {profileUser.title}
                </p>
              )}
            </div>

            {profileUser.bio && (
              <div className="mb-6">
                <p className="text-gray-700">{profileUser.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {profileUser.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{profileUser.email}</span>
                </div>
              )}
              {profileUser.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.createdAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Joined{" "}
                    {new Date(profileUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {profileUser.skills && profileUser.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profileUser.interests && profileUser.interests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
