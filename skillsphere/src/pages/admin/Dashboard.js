import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { frameworkAPI } from '../../services/api';

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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{categories.length}</p>
              <p className="text-xs text-green-600 mt-1">↑ Active</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Skill Frameworks</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{frameworks.length}</p>
              <p className="text-xs text-green-600 mt-1">↑ Generated</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Job Roles</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{frameworks.length}</p>
              <p className="text-xs text-blue-600 mt-1">Mapped</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💼</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">98%</p>
              <p className="text-xs text-green-600 mt-1">Excellent</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('job-role-management')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
          >
            <div className="text-2xl mb-2">📤</div>
            <div className="font-semibold text-gray-800">Upload CSV Data</div>
            <div className="text-sm text-gray-600 mt-1">Import job roles and skills</div>
          </button>
          <button
            onClick={() => setActiveTab('skill-framework')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold text-gray-800">View Frameworks</div>
            <div className="text-sm text-gray-600 mt-1">Browse skill frameworks</div>
          </button>
          <button
            onClick={() => setActiveTab('gap-analysis-config')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-800">Configure Analysis</div>
            <div className="text-sm text-gray-600 mt-1">Set up gap analysis</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
              ✓
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-800">CSV file uploaded successfully</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              +
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-800">New frameworks generated</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
