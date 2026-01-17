import React, { useState, useEffect } from 'react';
import { adminAPI, frameworkAPI } from '../services/api';
import { authHelpers } from '../services/api';

const AdminDashboard = ({ onLogout }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [frameworks, setFrameworks] = useState([]);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    if (activeTab === 'frameworks') {
      loadFrameworks();
    }
  }, [activeTab]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setMessage({ type: 'error', text: 'Failed to load categories' });
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadFrameworks = async () => {
    setLoadingFrameworks(true);
    try {
      const response = await frameworkAPI.getFrameworks();
      const frameworksData = response.data;
      setFrameworks(frameworksData);
      
      // Extract unique categories from frameworks
      const uniqueCategories = [...new Set(frameworksData.map(fw => fw.domain))].sort();
      setAvailableCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading frameworks:', error);
      setMessage({ type: 'error', text: 'Failed to load skill frameworks' });
    } finally {
      setLoadingFrameworks(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Please select a CSV file' });
        setFile(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a CSV file to upload' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await adminAPI.uploadCSV(formData);
      
      // Store upload result
      setUploadResult(response.data);
      
      const successMessage = `Successfully uploaded! 
        • ${response.data.categoriesCount} categories extracted
        • ${response.data.frameworksCount} skill frameworks generated`;
      
      setMessage({
        type: 'success',
        text: successMessage,
      });
      
      setFile(null);
      // Reset file input
      document.getElementById('csvFileInput').value = '';
      
      // Reload categories and frameworks
      await loadCategories();
      if (activeTab === 'frameworks') {
        await loadFrameworks();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload CSV file',
      });
    } finally {
      setUploading(false);
    }
  };

  const user = authHelpers.getAuth().user;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3">
                SS
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">Platform Lead</div>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'upload'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload Data
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'categories'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('frameworks')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'frameworks'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Skill Frameworks ({frameworks.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload CSV File - Skill Framework Generator</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-sm text-blue-800 font-medium mb-2">📋 Required CSV Format:</p>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li><strong>job_title</strong> - Job role name (descriptions will be auto-removed)</li>
                <li><strong>category</strong> - Domain/sector (e.g., "Healthcare", "Technology")</li>
                <li><strong>job_skill_set</strong> - OR individual columns:</li>
                <li className="ml-4"><strong>easy_skills</strong> - Comma-separated beginner skills</li>
                <li className="ml-4"><strong>medium_skills</strong> - Comma-separated intermediate skills</li>
                <li className="ml-4"><strong>hard_skills</strong> - Comma-separated advanced skills</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                Note: Job titles are automatically cleaned (descriptions removed). Skills are grouped by category for display.
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Upload a CSV file to automatically extract categories and generate skill frameworks for each job role. 
              The system will map skills by difficulty level (easy=2, medium=3, hard=5).
            </p>

            {/* Message Display */}
            {message.text && (
              <div
                className={`mb-6 px-4 py-3 rounded-lg border-l-4 ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-red-50 border-red-500 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label
                  htmlFor="csvFileInput"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Select CSV File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="csvFileInput"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="csvFileInput"
                          name="csvFile"
                          type="file"
                          accept=".csv"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV files only</p>
                    {file && (
                      <p className="text-sm text-purple-600 font-medium mt-2">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </form>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Categories</h2>
              <button
                onClick={loadCategories}
                disabled={loadingCategories}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-60"
              >
                {loadingCategories ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loadingCategories ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-500">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No categories found. Upload a CSV file to extract categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors"
                  >
                    <div className="font-semibold text-gray-800">{category.displayName}</div>
                    <div className="text-sm text-gray-500 mt-1">{category.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skill Frameworks Tab */}
        {activeTab === 'frameworks' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Skill Frameworks</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Auto-generated frameworks mapping job roles to required skills
                </p>
              </div>
              <button
                onClick={loadFrameworks}
                disabled={loadingFrameworks}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-60"
              >
                {loadingFrameworks ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loadingFrameworks ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-500">Loading skill frameworks...</p>
              </div>
            ) : frameworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No skill frameworks found.</p>
                <p className="text-sm text-gray-400">
                  Upload a CSV file with job_title, category, and skill columns to generate frameworks.
                </p>
              </div>
            ) : (
              <div>
                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Category:</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-900 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Categories ({frameworks.length})
                    </button>
                    {availableCategories.map((category) => {
                      const categoryCount = frameworks.filter(fw => fw.domain === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-purple-600 to-purple-900 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {category.replace(/-/g, ' ')} ({categoryCount})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filtered Frameworks */}
                <div className="space-y-4">
                  {(() => {
                    // Filter frameworks based on selected category
                    const filteredFrameworks = selectedCategory === 'all'
                      ? frameworks
                      : frameworks.filter(fw => fw.domain === selectedCategory);

                    if (filteredFrameworks.length === 0) {
                      return (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No frameworks found for this category.</p>
                        </div>
                      );
                    }

                    return filteredFrameworks.map((framework) => (
                      <div
                        key={framework._id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 transition-colors shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-800">
                                {framework.roleName}
                              </h4>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                                {framework.domain.replace(/-/g, ' ')}
                              </span>
                            </div>
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {framework.totalSkills} Skills
                            </span>
                          </div>
                        </div>

                        {framework.skills && framework.skills.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {/* Group skills by category */}
                            {['easy', 'medium', 'hard'].map((category) => {
                              const categorySkills = framework.skills.filter(
                                (s) => s.category === category
                              );
                              if (categorySkills.length === 0) return null;

                              return (
                                <div key={category} className="bg-gray-50 rounded-lg p-4">
                                  <h5 className="text-sm font-semibold text-gray-700 mb-3 capitalize flex items-center gap-2">
                                    <span
                                      className={`w-3 h-3 rounded-full ${
                                        category === 'easy'
                                          ? 'bg-green-500'
                                          : category === 'medium'
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                      }`}
                                    ></span>
                                    {category} Skills ({categorySkills.length})
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {categorySkills.map((skill, index) => (
                                      <span
                                        key={index}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                          category === 'easy'
                                            ? 'bg-green-100 text-green-800 border border-green-300'
                                            : category === 'medium'
                                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                            : 'bg-red-100 text-red-800 border border-red-300'
                                        }`}
                                      >
                                        {skill.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
