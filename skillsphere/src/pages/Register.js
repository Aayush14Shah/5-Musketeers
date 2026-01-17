import React, { useState, useEffect } from 'react';
import { authAPI, categoryAPI } from '../services/api';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    domainInterest: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { name: 'healthcare', displayName: 'Healthcare' },
        { name: 'agriculture', displayName: 'Agriculture' },
        { name: 'urban', displayName: 'Smart Cities' },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleDomainSelect = (domain) => {
    setFormData({
      ...formData,
      domainInterest: domain,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.domainInterest) {
      setError('Please select a domain of interest');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await authAPI.register(registrationData);
      const { token, ...userData } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setSuccess(`Registration successful! Welcome, ${userData.name}!`);
      console.log('User registered:', userData);

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        if (userData.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 1500);

      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        domainInterest: '',
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 animate-slideUp border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-3xl font-bold">
            SS
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">
            Start your skill development journey today
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
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {/* Domain Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Domain of Interest
            </label>
            {loadingCategories ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No categories available. Please contact admin.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category._id || category.name}
                    onClick={() => handleDomainSelect(category.name)}
                    className={`p-3 border-2 rounded-xl text-center cursor-pointer transition-all duration-300 text-xs font-medium ${formData.domainInterest === category.name
                        ? 'border-indigo-600 bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                        : 'border-gray-200 bg-white hover:border-indigo-600 hover:bg-gray-50'
                      }`}
                  >
                    <div>{category.displayName || category.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center mt-5 text-gray-500 text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-600 font-semibold hover:underline focus:outline-none"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
