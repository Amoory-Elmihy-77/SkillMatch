import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { MapPin, Clock, DollarSign, Globe, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  useEffect(() => {
    if (user && opportunity) {
      checkIfSaved();
    }
  }, [user, opportunity]);

  const checkIfSaved = async () => {
    try {
      const response = await api.get('/auth/me/saved');
      const savedOpps = response.data.data?.savedOpportunities || [];
      const isCurrentlySaved = savedOpps.some(opp => opp._id === opportunity._id);
      setIsSaved(isCurrentlySaved);
    } catch (error) {
      console.error('Failed to check saved status:', error);
      // Fallback to user object if available
      setIsSaved(user?.savedOpportunities?.includes(opportunity._id) || false);
    }
  };

  const fetchOpportunity = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/opportunities/${id}`);
      setOpportunity(response.data.data.opportunity);
    } catch (error) {
      console.error('Failed to fetch opportunity', error);
      toast.error('Failed to load opportunity details');
      navigate('/opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save');
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/opportunities/unsave/${opportunity._id}`);
        toast.success('Removed from saved');
        setIsSaved(false);
      } else {
        await api.post(`/opportunities/save/${opportunity._id}`);
        toast.success('Saved successfully');
        setIsSaved(true);
      }
    } catch (error) {
      toast.error('Failed to update saved status');
    }
  };

  if (loading) return <Loader />;
  if (!opportunity) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${opportunity.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                  {opportunity.type === 'job' ? 'Job Opportunity' : 'Learning Resource'}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <p className="text-xl text-gray-600">{opportunity.company || 'Unknown Provider'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className={`p-3 rounded-lg border transition-colors ${isSaved
                      ? 'bg-primary-50 border-primary-200 text-primary-600'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {opportunity.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {opportunity.location}
                </div>
              )}
              {opportunity.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {opportunity.salary}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Posted {new Date(opportunity.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-blue max-w-none text-gray-600">
                  <p>{opportunity.description}</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">Apply Now</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Interested in this opportunity? Click below to apply directly on the provider's website.
                </p>
                <a
                  href="#"
                  className="block w-full py-3 px-4 bg-primary-600 text-white text-center rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Apply Now
                </a>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{opportunity.company}</p>
                    <a href="#" className="text-xs text-primary-600 hover:underline">Visit Website</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
