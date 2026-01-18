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
  const [showPassword, setShowPassword] = useState(false);

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

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak' };
    if (password.length < 10) return { strength: 2, text: 'Medium' };
    return { strength: 3, text: 'Strong password' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-50">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col p-6 lg:p-8 xl:p-12 overflow-y-auto">
        {/* Logo */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              SS
            </div>
            <span className="ml-3 text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SkillSphere
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Create your Account</h1>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">Start your skill development journey with SkillSphere's intelligent learning platform.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg mb-4 border-l-4 border-red-500 text-sm animate-slideDown flex items-center space-x-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-lg mb-4 border-l-4 border-green-500 text-sm animate-slideDown flex items-center space-x-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Two Column Layout for Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 hover:border-gray-400 bg-white placeholder-gray-400"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Academic Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Academic Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 hover:border-gray-400 bg-white placeholder-gray-400"
                    placeholder="name@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Must be a valid .edu address</span>
                </p>
              </div>
            </div>

            {/* Two Column Layout for Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 hover:border-gray-400 bg-white placeholder-gray-400"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.strength === 1
                            ? 'bg-red-500 w-1/3'
                            : passwordStrength.strength === 2
                              ? 'bg-yellow-500 w-2/3'
                              : 'bg-green-500 w-full'
                          }`}
                      ></div>
                    </div>
                    {passwordStrength.text && (
                      <p className={`text-xs mt-1.5 font-medium ${passwordStrength.strength === 3
                          ? 'text-green-600'
                          : passwordStrength.strength === 2
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                        {passwordStrength.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 hover:border-gray-400 bg-white placeholder-gray-400"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Domain Selection - Full Width */}
            <div className="space-y-2">
              <label htmlFor="domainInterest" className="block text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Domain of Interest
              </label>
              {loadingCategories ? (
                <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-xs text-gray-500">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-3 text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                  No categories available. Please contact admin.
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <select
                    id="domainInterest"
                    name="domainInterest"
                    value={formData.domainInterest}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 hover:border-gray-400 bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select your domain of interest...</option>
                    {categories.map((category) => (
                      <option key={category._id || category.name} value={category.name}>
                        {category.displayName || (category.name.charAt(0).toUpperCase() + category.name.slice(1))}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center group active:scale-[0.98] mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
              >
                Log in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 pb-4">
          <p className="text-xs text-gray-400 text-center">©2024 SkillSphere Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Graphics */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Abstract Skill Graphics */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] animate-pulse-slow">
            {/* Concentric Circles with Skill Nodes */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-indigo-400/30 rounded-full animate-spin-slow"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-purple-400/40 rounded-full animate-spin-slow-reverse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-indigo-300/50 rounded-full"></div>

            {/* Center Circle - Skill Core */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full shadow-2xl shadow-indigo-400/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Skill Nodes - Connected Learning Path */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-indigo-400/50 animate-pulse"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              );
            })}

            {/* Connection Lines */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-0.5 h-40 bg-gradient-to-b from-indigo-400/20 via-purple-400/30 to-transparent origin-top transform -translate-x-1/2"
                  style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-50%)` }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Promotional Text */}
        <div className="absolute bottom-12 left-12 right-12 animate-fadeInUp delay-300">
          <h2 className="text-4xl font-bold text-white mb-3 leading-tight">Start Your Learning Journey</h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Join SkillSphere to unlock personalized skill development, intelligent gap analysis, and tailored learning pathways.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
