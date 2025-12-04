import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/Loader';
import { Users, Filter, CheckCircle, XCircle, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserAvatarUrl } from '../../utils/avatar';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchApplications();
    }, [filter, page]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            params.append('page', page);
            params.append('limit', 20);

            const response = await api.get(`/admin/applications?${params.toString()}`);
            const apps = response.data.data?.applications || [];
            setApplications(apps);
            setTotalPages(response.data.data?.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            toast.error('Failed to load applications');
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', icon: <Clock className="w-4 h-4" />, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
            case 'reviewed':
                return { label: 'Reviewed', icon: <FileText className="w-4 h-4" />, className: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'accepted':
                return { label: 'Accepted', icon: <CheckCircle className="w-4 h-4" />, className: 'bg-green-50 text-green-700 border-green-200' };
            case 'rejected':
                return { label: 'Rejected', icon: <XCircle className="w-4 h-4" />, className: 'bg-red-50 text-red-700 border-red-200' };
            default:
                return { label: status, icon: <FileText className="w-4 h-4" />, className: 'bg-gray-50 text-gray-700 border-gray-200' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Applications</h1>
                    <p className="text-gray-600 mt-2">System-wide application management</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <div className="flex gap-2">
                        {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilter(status);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === status
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications List */}
                {loading ? (
                    <Loader />
                ) : applications.length > 0 ? (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applicant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Opportunity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Manager
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((app) => {
                                        const statusConfig = getStatusConfig(app.status);
                                        return (
                                            <tr key={app._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={getUserAvatarUrl(app.applicant)}
                                                            alt={app.applicant?.name}
                                                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                        />
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{app.applicant?.name}</div>
                                                            <div className="text-sm text-gray-500">{app.applicant?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/opportunities/${app.opportunity?._id}`}
                                                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                                    >
                                                        {app.opportunity?.title}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{app.opportunity?.createdBy?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm ${statusConfig.className}`}>
                                                        {statusConfig.icon}
                                                        <span className="font-medium">{statusConfig.label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No applications found
                        </h3>
                        <p className="text-gray-500">
                            {filter !== 'all' ? `No ${filter} applications` : 'No applications in the system'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApplications;
