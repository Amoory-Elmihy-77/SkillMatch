import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import OpportunityCard from "../components/OpportunityCard";
import Loader from "../components/Loader";
import { Filter, SlidersHorizontal, Sparkles, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Recommended = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showingFallback, setShowingFallback] = useState(false);

  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    setLoading(true);
    try {
      const response = await api.get("/opportunities/recommended");

      const recommendedOpps =
        response.data.data?.recommendedOpportunities ||
        response.data.data?.opportunities ||
        [];

      if (recommendedOpps.length === 0) {
        setShowingFallback(true);
        const fallbackResponse = await api.get("/opportunities");
        const allOpps = fallbackResponse.data.data?.opportunities || [];
        setOpportunities(allOpps);
      } else {
        setShowingFallback(false);
        setOpportunities(recommendedOpps);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to fetch recommendations", error);
        console.error("Error details:", error.response?.data);
      }
      try {
        setShowingFallback(true);
        const fallbackResponse = await api.get("/opportunities");
        const allOpps = fallbackResponse.data.data?.opportunities || [];
        setOpportunities(allOpps);
      } catch (fallbackError) {
        setOpportunities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = (opportunities || []).filter((op) =>
    filter === "all" ? true : op.type === filter
  );

  const hasNoSkills = !user?.skills || user.skills.length === 0;
  const hasNoInterests = !user?.interests || user.interests.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {showingFallback
                ? "Explore Opportunities"
                : "Personalized Recommendations"}
            </h1>
          </div>
          <p className="text-gray-600">
            {showingFallback
              ? "Discover opportunities that match your interests"
              : "Based on your skills and activity"}
          </p>
        </div>

        {/* Profile Completion Alert */}
        {(hasNoSkills || hasNoInterests) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Complete your profile for better recommendations
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  {hasNoSkills && hasNoInterests
                    ? "Add your skills and interests to get personalized opportunity recommendations."
                    : hasNoSkills
                    ? "Add your skills to get more relevant job and course recommendations."
                    : "Add your interests to discover opportunities that match your goals."}
                </p>
                <Link
                  to="/me"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        )}

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
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {showingFallback && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Showing all opportunities
              </span>
            )}
          </div>
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
                <p className="text-gray-500 mb-4">
                  No opportunities found matching your criteria.
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommended;
