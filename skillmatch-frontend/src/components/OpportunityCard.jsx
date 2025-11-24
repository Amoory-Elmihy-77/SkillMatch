import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Clock, DollarSign } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const OpportunityCard = ({ opportunity, onSaveToggle }) => {
  const { user } = useAuth();
  const isSaved = user?.savedOpportunities?.includes(opportunity._id);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save opportunities');
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/opportunities/unsave/${opportunity._id}`);
        toast.success('Opportunity removed from saved');
      } else {
        await api.post(`/opportunities/save/${opportunity._id}`);
        toast.success('Opportunity saved');
      }
      if (onSaveToggle) onSaveToggle();
    } catch (error) {
      toast.error('Failed to update saved status');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{opportunity.title}</h3>
          <p className="text-sm text-gray-500">{opportunity.company || 'Unknown Company'}</p>
        </div>
        <div className={`p-2 rounded-lg ${opportunity.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
          <span className="text-xs font-semibold uppercase tracking-wide">
            {opportunity.type}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {opportunity.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {opportunity.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            {skill}
          </span>
        ))}
        {opportunity.skills?.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            +{opportunity.skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
        {opportunity.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {opportunity.location}
          </div>
        )}
        {opportunity.salary && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {opportunity.salary}
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(opportunity.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            isSaved
              ? 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <Link
          to={`/opportunities/${opportunity._id}`}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;
