import React, { useState, useEffect } from 'react';
import { frameworkAPI } from '../../services/api';

const RoleSkillMapping = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableDomains, setAvailableDomains] = useState([]);
  const [expandedRoles, setExpandedRoles] = useState(new Set());

  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    setLoading(true);
    try {
      const response = await frameworkAPI.getFrameworks();
      const frameworksData = response.data;
      setFrameworks(frameworksData);

      // Extract unique domains
      const uniqueDomains = [...new Set(frameworksData.map(fw => fw.domain))].sort();
      setAvailableDomains(uniqueDomains);
    } catch (error) {
      console.error('Error loading frameworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleExpansion = (roleId) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  // Filter frameworks based on domain and search query
  const filteredFrameworks = frameworks.filter(fw => {
    const domainMatch = selectedDomain === 'all' || fw.domain === selectedDomain;
    const searchMatch = searchQuery === '' || 
      fw.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return domainMatch && searchMatch;
  });

  // Group skills by category
  const groupSkillsByCategory = (skills) => {
    return {
      easy: skills.filter(s => s.category === 'easy'),
      medium: skills.filter(s => s.category === 'medium'),
      hard: skills.filter(s => s.category === 'hard'),
    };
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'easy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getImportanceBadge = (importance) => {
    const importanceMap = {
      2: { label: 'Low', color: 'bg-green-100 text-green-800' },
      3: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      5: { label: 'High', color: 'bg-red-100 text-red-800' },
    };
    const imp = importanceMap[importance] || importanceMap[3];
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${imp.color}`}>
        {imp.label}
      </span>
    );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role-Skill Mapping</h1>
          <p className="text-gray-500 mt-1">View and manage mappings between job roles and required skills</p>
        </div>
        <button
          onClick={loadFrameworks}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-60 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Domain Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Domains</option>
              {availableDomains.map(domain => (
                <option key={domain} value={domain}>
                  {domain.charAt(0).toUpperCase() + domain.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Roles</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by role name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold">Total Roles:</span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold">{filteredFrameworks.length}</span>
          <span className="font-semibold ml-4">Total Skills Mapped:</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-bold">
            {filteredFrameworks.reduce((sum, fw) => sum + (fw.skills?.length || 0), 0)}
          </span>
        </div>
      </div>

      {/* Role-Skill Mappings */}
      <div className="space-y-4">
        {filteredFrameworks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No roles found matching your criteria</p>
          </div>
        ) : (
          filteredFrameworks.map((framework) => {
            const isExpanded = expandedRoles.has(framework._id);
            const skillsByCategory = groupSkillsByCategory(framework.skills || []);
            const totalSkills = framework.skills?.length || 0;

            return (
              <div
                key={framework._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Role Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleRoleExpansion(framework._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{framework.roleName}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold uppercase">
                          {framework.domain}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {totalSkills} Skills
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {skillsByCategory.easy.length} Easy
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          {skillsByCategory.medium.length} Medium
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {skillsByCategory.hard.length} Hard
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Skills View */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Skills by Category */}
                    <div className="space-y-4">
                      {/* Easy Skills */}
                      {skillsByCategory.easy.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-700">Easy Skills</h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                              {skillsByCategory.easy.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {skillsByCategory.easy.map((skill, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-3 border border-green-200 flex items-center justify-between"
                              >
                                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                {getImportanceBadge(skill.importance)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medium Skills */}
                      {skillsByCategory.medium.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-700">Medium Skills</h4>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                              {skillsByCategory.medium.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {skillsByCategory.medium.map((skill, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-3 border border-yellow-200 flex items-center justify-between"
                              >
                                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                {getImportanceBadge(skill.importance)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hard Skills */}
                      {skillsByCategory.hard.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-700">Hard Skills</h4>
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                              {skillsByCategory.hard.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {skillsByCategory.hard.map((skill, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-3 border border-red-200 flex items-center justify-between"
                              >
                                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                {getImportanceBadge(skill.importance)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {totalSkills === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No skills mapped for this role yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoleSkillMapping;
