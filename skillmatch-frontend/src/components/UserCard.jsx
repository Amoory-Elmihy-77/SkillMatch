import React from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden">
        <img
          src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{user.title || 'Member'}</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {user.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            {skill}
          </span>
        ))}
      </div>

      <Link
        to={`/users/${user._id}`} // Assuming we might have a public profile view, or just for admin
        className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
};

export default UserCard;
