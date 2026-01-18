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
    } finally {
      setLoading(false);
    }
  };

  // Dynamic domain extraction
  const availableDomains = useMemo(() => {
    return [...new Set(
      frameworks
        .map(fw => fw.domain)
        .filter(domain => domain && typeof domain === 'string' && domain.trim().length > 0)
    )].sort();
  }, [frameworks]);

  // Dynamic filtering
  const filteredFrameworks = useMemo(() => {
    return frameworks.filter(fw => {
      const domainMatch = selectedDomain === 'all' || (fw.domain && fw.domain === selectedDomain);
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = !searchQuery || 
        fw.roleName?.toLowerCase().includes(searchLower) ||
        (fw.domain && typeof fw.domain === 'string' && fw.domain.toLowerCase().includes(searchLower));
      return domainMatch && searchMatch;
    });
  }, [frameworks, selectedDomain, searchQuery]);

  // Dynamic stats
  const stats = useMemo(() => ({
    totalRoles: filteredFrameworks.length,
    totalSkills: filteredFrameworks.reduce((sum, fw) => sum + (fw.skills?.length || 0), 0),
  }), [filteredFrameworks]);

  const toggleRoleExpansion = (roleId) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      newSet.has(roleId) ? newSet.delete(roleId) : newSet.add(roleId);
      return newSet;
    });
  };

  // Dynamic category configuration
  const categoryConfig = {
    easy: { label: 'Easy', bg: 'bg-green-50', bgBadge: 'bg-green-100', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
    medium: { label: 'Medium', bg: 'bg-yellow-50', bgBadge: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    hard: { label: 'Hard', bg: 'bg-red-50', bgBadge: 'bg-red-100', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  };

  const importanceConfig = {
    2: { label: 'Low', color: 'bg-green-100 text-green-800' },
    3: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    5: { label: 'High', color: 'bg-red-100 text-red-800' },
  };

  const groupSkillsByCategory = (skills) => {
    if (!skills || !Array.isArray(skills)) return { easy: [], medium: [], hard: [] };
    return {
      easy: skills.filter(s => s.category === 'easy'),
      medium: skills.filter(s => s.category === 'medium'),
      hard: skills.filter(s => s.category === 'hard'),
    };
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

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Domains</option>
              {availableDomains.map((domain, index) => {
                // Double-check domain is valid before using string methods
                if (!domain || typeof domain !== 'string' || domain.trim().length === 0) {
                  return null;
                }
                const displayName = domain.charAt(0).toUpperCase() + domain.slice(1);
                return (
                  <option key={`domain-${domain}-${index}`} value={domain}>
                    {displayName}
                  </option>
                );
              }).filter(Boolean)}
            </select>
          </div>
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
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold">Total Roles:</span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold">{stats.totalRoles}</span>
          <span className="font-semibold ml-4">Total Skills Mapped:</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-bold">{stats.totalSkills}</span>
        </div>
      </div>

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
            const skillsByCategory = groupSkillsByCategory(framework.skills);
            const totalSkills = framework.skills?.length || 0;

            return (
              <div
                key={framework._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleRoleExpansion(framework._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{framework.roleName || 'Unknown Role'}</h3>
                        {framework.domain && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold uppercase">
                            {framework.domain}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {totalSkills} Skills
                        </span>
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <span key={key} className="flex items-center gap-2">
                            <span className={`w-2 h-2 ${config.dot} rounded-full`}></span>
                            {skillsByCategory[key]?.length || 0} {config.label}
                          </span>
                        ))}
                      </div>
                    </div>
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

                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="space-y-4">
                      {Object.entries(categoryConfig).map(([key, config]) => {
                        const skills = skillsByCategory[key] || [];
                        if (skills.length === 0) return null;
                        
                        return (
                          <div key={key}>
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="font-semibold text-gray-700">{config.label} Skills</h4>
                              <span className={`px-2 py-1 ${config.bgBadge} ${config.text} rounded text-xs font-semibold`}>
                                {skills.length}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {skills.map((skill, idx) => (
                                <div
                                  key={`${key}-${skill.name}-${idx}`}
                                  className={`bg-white rounded-lg p-3 border ${config.border} flex items-center justify-between`}
                                >
                                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${importanceConfig[skill.importance]?.color || importanceConfig[3].color}`}>
                                    {importanceConfig[skill.importance]?.label || 'Medium'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
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
