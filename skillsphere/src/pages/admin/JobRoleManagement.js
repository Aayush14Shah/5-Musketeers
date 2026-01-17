import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import { frameworkAPI } from '../../services/api';

const JobRoleManagement = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

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

      const successMessage = `Successfully uploaded! 
        • ${response.data.categoriesCount} categories extracted
        • ${response.data.frameworksCount} skill frameworks generated`;

      setMessage({
        type: 'success',
        text: successMessage,
      });

      setFile(null);
      document.getElementById('csvFileInput').value = '';

      await loadCategories();
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

  React.useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
          className={`mb-6 px-4 py-3 rounded-lg border-l-4 ${message.type === 'success'
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
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors bg-gray-50">
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
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2"
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
                <p className="text-sm text-indigo-600 font-medium mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>
    </div>
  );
};

export default JobRoleManagement;
