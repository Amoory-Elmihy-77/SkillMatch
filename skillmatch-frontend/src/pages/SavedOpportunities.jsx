import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import Loader from '../components/Loader';
import { Heart, Bookmark } from 'lucide-react';

const SavedOpportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedOpportunities();
    }, []);

    const fetchSavedOpportunities = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/me/saved');
            const savedOpps = response.data.data?.savedOpportunities || [];
            setOpportunities(savedOpps);
        } catch (error) {
            console.error('Failed to fetch saved opportunities:', error);
            setOpportunities([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Saved Opportunities
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Your bookmarked opportunities for later review
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <Loader />
                ) : opportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opp) => (
                            <OpportunityCard key={opp._id} opportunity={opp} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Bookmark className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No saved opportunities yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Start saving opportunities to keep track of them here
                        </p>
                        <Link
                            to="/opportunities"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Browse Opportunities
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedOpportunities;
