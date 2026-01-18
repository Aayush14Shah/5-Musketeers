import React, { useState } from 'react';
import { linkedinAPI } from '../services/api';

const LinkedInImport = ({ onImportSuccess }) => {
  const [activeMethod, setActiveMethod] = useState('json');
  const [jsonInput, setJsonInput] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [sampleData, setSampleData] = useState(null);

  const handleLoadSampleData = async () => {
    try {
      setLoading(true);
      const response = await linkedinAPI.getSampleData();
      setSampleData(response.data.sampleData);
      setShowSampleData(true);
    } catch (err) {
      setError('Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  const handleUseSampleData = () => {
    setJsonInput(JSON.stringify(sampleData, null, 2));
    setShowSampleData(false);
  };

  const handleParseJSON = async () => {
    if (!jsonInput.trim()) {
      setError('Please paste your LinkedIn JSON data');
      return;
    }

    setLoading(true);
    setError('');
    setParsedData(null);

    try {
      const response = await linkedinAPI.parseJSON(jsonInput);
      setParsedData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to parse LinkedIn data');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateURL = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter your LinkedIn profile URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await linkedinAPI.parseURL(linkedinUrl);
      setError('');
      alert(response.data.suggestion);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid LinkedIn URL');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData) {
      setError('Please parse your LinkedIn data first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await linkedinAPI.importData({
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        certifications: parsedData.certifications,
        suggestedDomain: parsedData.suggestedDomain
      });

      setImportSuccess(true);
      if (onImportSuccess) {
        onImportSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import LinkedIn data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJsonInput('');
    setLinkedinUrl('');
    setParsedData(null);
    setImportSuccess(false);
    setError('');
  };

  if (importSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Successful!</h2>
          <p className="text-gray-600 mb-6">Your LinkedIn data has been imported to your profile.</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Import More Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">LinkedIn Import</h2>
              <p className="text-blue-100 text-sm">Import your skills and experience from LinkedIn</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveMethod('json')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeMethod === 'json'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              JSON Import
            </button>
            <button
              onClick={() => setActiveMethod('url')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeMethod === 'url'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Profile URL
            </button>
          </div>

          {activeMethod === 'json' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">How to get your LinkedIn data:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Go to LinkedIn Settings & Privacy</li>
                  <li>Click on "Data Privacy"</li>
                  <li>Select "Get a copy of your data"</li>
                  <li>Download and extract the ZIP file</li>
                  <li>Open the relevant JSON files and paste below</li>
                </ol>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleLoadSampleData}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    View sample data format
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Paste your LinkedIn JSON data:
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"name": "John Doe", "skills": [...], "experience": [...], ...}'
                  className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
                />
              </div>

              <button
                onClick={handleParseJSON}
                disabled={loading || !jsonInput.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Parsing...' : 'Parse LinkedIn Data'}
              </button>
            </div>
          )}

          {activeMethod === 'url' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Note about URL Import:</h4>
                <p className="text-sm text-yellow-700">
                  Due to LinkedIn's API restrictions, URL-based import has limited functionality. 
                  For best results, use the JSON export method.
                </p>
              </div>

              <div>
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Your LinkedIn Profile URL:
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleValidateURL}
                disabled={loading || !linkedinUrl.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Validating...' : 'Validate URL'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {showSampleData && sampleData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Sample LinkedIn Data Format</h3>
            <button
              onClick={() => setShowSampleData(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm max-h-64">
              {JSON.stringify(sampleData, null, 2)}
            </pre>
            <button
              onClick={handleUseSampleData}
              className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              Use This Sample Data
            </button>
          </div>
        </div>
      )}

      {parsedData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Extracted Data Preview</h3>
            <p className="text-green-100 text-sm">Review the data before importing</p>
          </div>

          <div className="p-6 space-y-6">
            {parsedData.profile && parsedData.profile.name && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Profile Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{parsedData.profile.name}</span>
                  </div>
                  {parsedData.profile.headline && (
                    <div>
                      <span className="text-gray-500">Headline:</span>
                      <span className="ml-2 font-medium">{parsedData.profile.headline}</span>
                    </div>
                  )}
                  {parsedData.profile.location && (
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium">{parsedData.profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {parsedData.suggestedDomain && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Suggested Domain</h4>
                <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium capitalize">
                  {parsedData.suggestedDomain}
                </span>
                <p className="text-sm text-purple-600 mt-2">
                  Based on your skills and experience, we recommend this domain for you.
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Skills ({parsedData.skills?.length || 0})
                <span className="text-xs font-normal text-gray-500">Will be added to your profile</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills?.slice(0, 20).map((skill, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      skill.extracted
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {skill.name}
                    <span className="ml-1 text-xs opacity-70">({skill.level})</span>
                  </span>
                ))}
                {parsedData.skills?.length > 20 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    +{parsedData.skills.length - 20} more
                  </span>
                )}
              </div>
            </div>

            {parsedData.experience?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Experience ({parsedData.experience.length})
                </h4>
                <div className="space-y-3">
                  {parsedData.experience.slice(0, 3).map((exp, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-800">{exp.title}</div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                      <div className="text-xs text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.education?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Education ({parsedData.education.length})
                </h4>
                <div className="space-y-3">
                  {parsedData.education.map((edu, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-800">{edu.school}</div>
                      <div className="text-sm text-gray-600">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.certifications?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Certifications ({parsedData.certifications.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                    >
                      {cert.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Import Summary</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {parsedData.totalExtracted?.skills || 0}
                  </div>
                  <div className="text-xs text-gray-500">Skills</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {parsedData.totalExtracted?.experience || 0}
                  </div>
                  <div className="text-xs text-gray-500">Jobs</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {parsedData.totalExtracted?.education || 0}
                  </div>
                  <div className="text-xs text-gray-500">Education</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">
                    {parsedData.totalExtracted?.certifications || 0}
                  </div>
                  <div className="text-xs text-gray-500">Certs</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setParsedData(null)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import to Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInImport;
