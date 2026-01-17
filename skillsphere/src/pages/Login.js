import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, ...userData } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setSuccess(`Login successful! Welcome, ${userData.name}!`);
      console.log('User logged in:', userData);

      // Call onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      // Redirect admin to admin dashboard after a short delay
      if (userData.role === 'admin') {
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900 p-5">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 animate-slideUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-3xl font-bold">
            SS
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-5 border-l-4 border-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl mb-5 border-l-4 border-green-800 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-xl text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center mt-5 text-gray-500 text-sm">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="text-purple-600 font-semibold hover:underline focus:outline-none"
          >
            Create one now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
