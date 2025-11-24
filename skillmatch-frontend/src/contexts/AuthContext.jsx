import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      console.error('Login failed', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.status === 'success') {
        toast.success('Signup successful! Please verify your email.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup failed', error);
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const verify = async (email, code) => {
    try {
      const response = await api.post('/auth/verify', { email, code });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Email verified successfully!');
      return true;
    } catch (error) {
      console.error('Verification failed', error);
      toast.error(error.response?.data?.message || 'Verification failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.patch('/auth/updateMe', data);
      setUser(response.data.data.user);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update failed', error);
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    verify,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
