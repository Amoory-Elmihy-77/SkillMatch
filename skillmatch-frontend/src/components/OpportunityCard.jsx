import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const OpportunityCard = ({ opportunity }) => {
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

      <Link
        to={`/opportunities/${opportunity._id}`}
        className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default OpportunityCard;
