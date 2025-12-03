import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ConnectionButton = ({ userId, initialStatus = null, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialStatus && userId) {
      fetchConnectionStatus();
    }
  }, [userId, initialStatus]);

  const fetchConnectionStatus = async () => {
    try {
      const response = await api.get(`/connections/status/${userId}`);
      const currentStatus = response.data.data?.connectionStatus || null;

      if (currentStatus === 'accepted') {
        setStatus('connected');
      } else if (currentStatus === 'sent' || currentStatus === 'received') {
        setStatus('pending');
      } else {
        setStatus(null);
      }

    } catch (error) {
      console.error('Failed to fetch connection status:', error);
      setStatus(null);
    }
  };

  const handleConnect = async () => {
    if (loading || status) return;

    setLoading(true);
    try {
      const response = await api.post('/connections/send', {
        receiverId: userId,
      });

      setStatus('pending');
      toast.success('Connection request sent!');
      if (onStatusChange) {
        onStatusChange('pending');
      }
    } catch (error) {
      console.error('Failed to send connection request:', error);

      if (error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || '';

        if (errorMessage.includes('accepted')) {
          setStatus('connected');
          toast.success('You are already connected!');
          if (onStatusChange) onStatusChange('connected');
        } else {
          setStatus('pending');
          toast.error('Connection request already sent');
          if (onStatusChange) onStatusChange('pending');
        }
      } else { toast.error(error.response?.data?.message || 'Failed to send connection request'); }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'connected') {
    return (
      <span className="flex items-center gap-2 px-4 py-2 text-green-700 font-medium bg-green-50 rounded-lg border border-green-200">
        <UserCheck className="w-4 h-4" />
        Connected
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg font-medium cursor-default"
      >
        <Clock className="w-4 h-4" />
        Request Sent (Pending)
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <UserPlus className="w-4 h-4" />
      {loading ? 'Sending...' : 'Connect'}
    </button>
  );
};

export default ConnectionButton;