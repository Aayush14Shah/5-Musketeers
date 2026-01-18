import React, { useState, useEffect, useMemo } from 'react';
import { frameworkAPI } from '../../services/api';

const RoleSkillMapping = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoles, setExpandedRoles] = useState(new Set());

  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    setLoading(true);
    try {
      const response = await frameworkAPI.getFrameworks();
      setFrameworks(response?.data || []);
    } catch (error) {
      console.error('Error loading frameworks:', error);
      setFrameworks([]);
import React, { useState, useEffect } from 'react';
import { adminAPI, frameworkAPI } from '../../services/api';

// CSV Data Structure from courses.csv
const CSV_DATA_MAPPING = {
  domains: [
    'web-development', 'data-science', 'cloud-computing', 
    'mobile-development', 'software-engineering', 'cybersecurity', 
    'game-development', 'ui-ux-design'
  ],
  domainStats: {
    'web-development': { count: 12, skills: 45, roles: 8 },
    'data-science': { count: 11, skills: 38, roles: 7 },
    'cloud-computing': { count: 7, skills: 28, roles: 5 },
    'mobile-development': { count: 3, skills: 15, roles: 3 },
    'software-engineering': { count: 7, skills: 32, roles: 6 },
    'cybersecurity': { count: 3, skills: 18, roles: 3 },
    'game-development': { count: 2, skills: 12, roles: 2 },
    'ui-ux-design': { count: 4, skills: 16, roles: 4 }
  },
  skillsByDomain: {
    'web-development': ['React', 'JavaScript', 'Redux', 'React Router', 'Hooks', 'Vue.js', 'Node.js', 'Express', 'MongoDB'],
    'data-science': ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'TensorFlow', 'SQL', 'Tableau'],
    'cloud-computing': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Lambda', 'EC2', 'S3'],
    'mobile-development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
    'software-engineering': ['Java', 'C++', 'OOP', 'Design Patterns', 'Git', 'Unit Testing'],
    'cybersecurity': ['Network Security', 'Encryption', 'Penetration Testing', 'Firewalls'],
    'game-development': ['Unity', 'C#', 'Physics Engine', 'Unreal Engine'],
    'ui-ux-design': ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing']
  },
  platformStats: {
    'Udemy': { courses: 30, avgRating: 4.7 },
    'Coursera': { courses: 15, avgRating: 4.8 },
    'YouTube': { courses: 5, avgRating: 4.5 }
  }
};

const RoleSkillMapping = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalRoles: 0, totalSkills: 0, mappings: 0 });
  const [showCsvData, setShowCsvData] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedCategory(response.data[0]._id);
        loadFrameworksForCategory(response.data[0]._id);
      }
      calculateStats(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFrameworksForCategory = async (categoryId) => {
    try {
      const response = await frameworkAPI.getFrameworks({ category: categoryId });
      setFrameworks(response.data || []);
    } catch (error) {
      console.error('Error loading frameworks:', error);
    }
  };

  const calculateStats = (categories) => {
    let totalRoles = 0;
    let totalSkills = 0;
    let mappings = 0;

    categories.forEach(cat => {
      totalRoles += cat.jobRoles?.length || 0;
      cat.jobRoles?.forEach(role => {
        totalSkills += role.requiredSkills?.length || 0;
        mappings += (role.requiredSkills?.length || 0) > 0 ? 1 : 0;
      });
    });

    // Fallback to CSV data if database empty
    if (totalRoles === 0) {
      totalRoles = Object.values(CSV_DATA_MAPPING.domainStats).reduce((sum, d) => sum + d.roles, 0);
      totalSkills = Object.values(CSV_DATA_MAPPING.domainStats).reduce((sum, d) => sum + d.skills, 0);
      mappings = Object.values(CSV_DATA_MAPPING.domainStats).reduce((sum, d) => sum + d.count, 0);
    }

    setStats({ totalRoles, totalSkills, mappings });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    loadFrameworksForCategory(categoryId);
  };

  const StatItem = ({ label, value, icon, color }) => (
    <div className={`bg-${color}-50 rounded-lg p-4 border border-${color}-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <span className={`text-3xl text-${color}-600`}>{icon}</span>
      </div>
    </div>
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Role-Skill Mapping</h1>
        <p className="text-gray-600 mt-2">Manage and visualize the relationship between job roles and required skills</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatItem label="Total Job Roles" value={stats.totalRoles} icon="👔" color="blue" />
        <StatItem label="Total Skills" value={stats.totalSkills} icon="🎯" color="green" />
        <StatItem label="Active Mappings" value={stats.mappings} icon="🔗" color="purple" />
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id)}
              className={`p-4 rounded-lg font-medium transition-all ${
                selectedCategory === cat._id
                  ? 'bg-blue-600 text-white border-2 border-blue-700'
                  : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat.name}
              <span className="block text-sm font-normal opacity-75 mt-1">
                {cat.jobRoles?.length || 0} roles
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Frameworks Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Skill Frameworks</h2>
          <button
            onClick={() => setShowCsvData(!showCsvData)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {showCsvData ? '📊 CSV Data' : '🗄️ DB Data'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Framework Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Domain</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Skills Count</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {frameworks && frameworks.length > 0 ? (
                frameworks.map((fw, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{fw.name}</td>
                    <td className="px-6 py-4 text-gray-600">{fw.domain || 'General'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {fw.skills?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {fw.level || 'Intermediate'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No frameworks found for this category. Upload CSV data to create mappings.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Data Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV Domain Statistics */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">📊 Domains in CSV</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {CSV_DATA_MAPPING.domains.map((domain, idx) => {
                const domainData = CSV_DATA_MAPPING.domainStats[domain];
                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white rounded border border-blue-100 hover:border-blue-300 transition-colors">
                    <span className="text-sm font-medium text-gray-700 capitalize">{domain}</span>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">📚 {domainData.count}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🎯 {domainData.skills}</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">👔 {domainData.roles}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CSV Platform Statistics */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-bold text-gray-900 mb-3">📕 Platforms in CSV</h3>
            <div className="space-y-3">
              {Object.entries(CSV_DATA_MAPPING.platformStats).map(([platform, data], idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded border border-orange-100 hover:border-orange-300 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{platform}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">📕 {data.courses}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ {data.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills for Selected Domain */}
        {selectedCategory && CSV_DATA_MAPPING.skillsByDomain[selectedCategory] && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-bold text-gray-900 mb-3">🎯 Skills in Selected Domain</h3>
            <div className="flex flex-wrap gap-2">
              {CSV_DATA_MAPPING.skillsByDomain[selectedCategory].map((skill, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-300 hover:bg-green-200 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mapped Roles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mapped Roles</h2>
        {categories
          .find(c => c._id === selectedCategory)
          ?.jobRoles?.length > 0 ? (
          <div className="space-y-4">
            {categories
              .find(c => c._id === selectedCategory)
              ?.jobRoles?.map((role, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{role.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Required Skills: {role.requiredSkills?.length || 0}
                      </p>
                      {role.requiredSkills && role.requiredSkills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {role.requiredSkills.map((skill, skillIdx) => (
                            <span
                              key={skillIdx}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No roles mapped in this category yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSkillMapping;
