import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, XCircle, Send } from 'lucide-react';

const ApplicationButton = ({ opportunityId, onStatusChange }) => {
    const { user } = useAuth();
    const [status, setStatus] = useState('none');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (user && opportunityId) {
            checkApplicationStatus();
        }
    }, [user, opportunityId]);

    const checkApplicationStatus = async () => {
        setChecking(true);
        try {
            const response = await api.get(`/applications/status/${opportunityId}`);
            const applicationStatus = response.data.data?.status || 'none';
            setStatus(applicationStatus);
            if (onStatusChange) onStatusChange(applicationStatus);
        } catch (error) {
            console.error('Failed to check application status:', error);
            setStatus('none');
        } finally {
            setChecking(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            toast.error('Please login to apply');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/opportunities/apply/${opportunityId}`);
            toast.success('Application submitted successfully!');
            setStatus('pending');
            if (onStatusChange) onStatusChange('pending');
        } catch (error) {
            console.error('Failed to apply:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <button
                disabled
                className="w-full py-3 px-6 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
                Checking status...
            </button>
        );
    }

    const getButtonConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    text: 'Application Pending',
                    icon: <Clock className="w-5 h-5" />,
                    className: 'bg-yellow-50 text-yellow-700 border border-yellow-200 cursor-default',
                    disabled: true,
                };
            case 'reviewed':
                return {
                    text: 'Application Reviewed',
                    icon: <CheckCircle className="w-5 h-5" />,
                    className: 'bg-blue-50 text-blue-700 border border-blue-200 cursor-default',
                    disabled: true,
                };
            case 'accepted':
                return {
                    text: 'Application Accepted',
                    icon: <CheckCircle className="w-5 h-5" />,
                    className: 'bg-green-50 text-green-700 border border-green-200 cursor-default',
                    disabled: true,
                };
            case 'rejected':
                return {
                    text: 'Application Rejected',
                    icon: <XCircle className="w-5 h-5" />,
                    className: 'bg-red-50 text-red-700 border border-red-200 cursor-default',
                    disabled: true,
                };
            default:
                return {
                    text: 'Apply Now',
                    icon: <Send className="w-5 h-5" />,
                    className: 'bg-primary-600 text-white hover:bg-primary-700',
                    disabled: false,
                };
        }
    };

    const config = getButtonConfig();

    return (
        <button
            onClick={config.disabled ? undefined : handleApply}
            disabled={loading || config.disabled}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${config.className} ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            {config.icon}
            {loading ? 'Submitting...' : config.text}
        </button>
    );
};

export default ApplicationButton;
