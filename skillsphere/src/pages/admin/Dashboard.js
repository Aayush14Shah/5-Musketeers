import React, { useState, useEffect } from 'react';
import { adminAPI, frameworkAPI } from '../../services/api';

const Dashboard = ({ setActiveTab }) => {
  const [categories, setCategories] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, frameworksRes] = await Promise.all([
        adminAPI.getCategories(),
        frameworkAPI.getFrameworks(),
      ]);
      setCategories(categoriesRes.data);
      setFrameworks(frameworksRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtext, icon, colorClass, iconBgClass }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
          <div className={`flex items-center mt-2 text-sm font-medium ${subtext.includes('Active') || subtext.includes('Excellent') || subtext.includes('Generated') ? 'text-green-600' : 'text-blue-600'}`}>
            {subtext.includes('Active') || subtext.includes('Generated') || subtext.includes('Excellent') ? (
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {subtext}
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${iconBgClass} ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Administrator</p>
        </div>

        {/* Date/Time or extra header info can go here */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Categories"
          value={categories.length}
          subtext="Active"
          colorClass="text-blue-600"
          iconBgClass="bg-blue-50"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Skill Frameworks"
          value={frameworks.length}
          subtext="Generated"
          colorClass="text-green-600"
          iconBgClass="bg-green-50"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Job Roles"
          value={frameworks.length} // Assuming 1:1 for now as per original code
          subtext="Mapped"
          colorClass="text-purple-600"
          iconBgClass="bg-purple-50"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="System Health"
          value="98%"
          subtext="Excellent"
          colorClass="text-orange-600"
          iconBgClass="bg-orange-50"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
        <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
        <h2>Quick Actions</h2>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab('job-role-management')}
          className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload CSV Data</h3>
            <p className="text-sm text-gray-500 mb-6">Import comprehensive job roles and skill mapping datasets from your local files.</p>
            <div className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm group-hover:bg-indigo-700 transition-colors">
              Get Started
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('skill-framework')}
          className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">View Frameworks</h3>
            <p className="text-sm text-gray-500 mb-6">Browse and manage existing skill intelligence frameworks currently in production.</p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm group-hover:bg-gray-200 transition-colors">
              Browse All
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('gap-analysis-config')}
          className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Configure Analysis</h3>
            <p className="text-sm text-gray-500 mb-6">Set up parameters for automated gap analysis and intelligence gathering pipelines.</p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm group-hover:bg-gray-200 transition-colors">
              Open Settings
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <span className="w-8 h-1 bg-green-500 rounded-full"></span>
          <h2>Recent Activity</h2>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">View All Logs</button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <p className="text-base font-bold text-gray-800">CSV file uploaded successfully</p>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">TIMESTAMP</span>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Process completed in 2.4s • Data sanitized and validated</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          <div className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <p className="text-base font-bold text-gray-800">New frameworks generated</p>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">TIMESTAMP</span>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">5 hours ago</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">12 new industry standards integrated into the core engine</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          <div className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <p className="text-base font-bold text-gray-800">System maintenance scheduled</p>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">TIMESTAMP</span>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">Dec 12, 02:00 AM</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Automated backup and optimization cycle</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
