import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import Loader from '../components/Loader';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

const Opportunities = () => {
  const [searchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchOpportunities();
  }, [searchQuery]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await api.get('/opportunities', { params });
      const opps = response.data.data?.opportunities || response.data.opportunities || [];
      setOpportunities(opps);
    } catch (error) {
      console.error('Failed to fetch opportunities', error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = (opportunities || []).filter(op => 
    filter === 'all' ? true : op.type === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Opportunities'}
          </h1>
          <p className="text-gray-600">
            {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
          </p>
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
            More Filters
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard key={opp._id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try a different search term.`
                : 'No opportunities available at the moment. Check back later!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
