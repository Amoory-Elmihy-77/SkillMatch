import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/Loader';
import { Briefcase, Plus, MapPin, DollarSign, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerOpportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            const response = await api.get('/manager/opportunities');
            const opps = response.data.data?.opportunities || [];
            setOpportunities(opps);
        } catch (error) {
            console.error('Failed to fetch opportunities:', error);
            toast.error('Failed to load opportunities');
            setOpportunities([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Opportunities</h1>
                        <p className="text-gray-600 mt-2">Manage your job postings</p>
                    </div>
                    <Link
                        to="/admin/opportunities"
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Opportunity
                    </Link>
                </div>

                {/* Opportunities List */}
                {loading ? (
                    <Loader />
                ) : opportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opp) => (
                            <div
                                key={opp._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${opp.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                        }`}>
                                        {opp.type === 'job' ? 'Job' : 'Learning'}
                                    </div>
                                    <Link
                                        to={`/manager/applications?opportunityId=${opp._id}`}
                                        className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>{opp.applicationsCount || 0} applications</span>
                                    </Link>
                                </div>

                                <Link to={`/opportunities/${opp._id}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                                        {opp.title}
                                    </h3>
                                </Link>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {opp.description}
                                </p>

                                <div className="space-y-2 text-sm text-gray-500">
                                    {opp.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {opp.location}
                                        </div>
                                    )}
                                    {opp.salary && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            {opp.salary}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                    Posted {new Date(opp.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No opportunities yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Create your first job posting to start receiving applications
                        </p>
                        <Link
                            to="/admin/opportunities"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Opportunity
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerOpportunities;
