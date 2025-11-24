import React, { useEffect, useState } from 'react';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import Loader from '../components/Loader';
import { Filter, SlidersHorizontal } from 'lucide-react';

const Recommended = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, job, course, tool

  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    setLoading(true);
    try {
      const response = await api.get('/opportunities/recommended');
      setOpportunities(response.data.data.opportunities);
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(op => 
    filter === 'all' ? true : op.type === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalized Recommendations</h1>
          <p className="text-gray-600">Based on your skills and activity</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="job">Jobs</option>
              <option value="course">Courses</option>
              <option value="tool">Tools</option>
            </select>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" />
            Relevance
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No recommendations found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommended;
