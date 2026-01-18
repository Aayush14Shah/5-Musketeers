import React, { useState, useEffect } from 'react';
import { frameworkAPI } from '../../services/api';

const SkillFramework = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);

  const loadFrameworks = async () => {
    setLoadingFrameworks(true);
    try {
      const response = await frameworkAPI.getFrameworks();
      const frameworksData = response.data;
      setFrameworks(frameworksData);

      const uniqueCategories = [...new Set(frameworksData.map(fw => fw.domain))].sort();
      setAvailableCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading frameworks:', error);
    } finally {
      setLoadingFrameworks(false);
    }
  };

  useEffect(() => {
    loadFrameworks();
  }, []);

  const filteredFrameworks = selectedCategory === 'all'
    ? frameworks
    : frameworks.filter(fw => fw.domain === selectedCategory);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-60"
        >
          {loadingFrameworks ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loadingFrameworks ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
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
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${selectedCategory === category
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
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
            {filteredFrameworks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No frameworks found for this category.</p>
              </div>
            ) : (
              filteredFrameworks.map((framework) => (
                <div
                  key={framework._id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-800">
                          {framework.roleName}
                        </h4>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium capitalize">
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
                      {['easy', 'medium', 'hard'].map((category) => {
                        const categorySkills = framework.skills.filter(
                          (s) => s.category === category
                        );
                        if (categorySkills.length === 0) return null;

                        return (
                          <div key={category} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 capitalize flex items-center gap-2">
                              <span
                                className={`w-3 h-3 rounded-full ${category === 'easy'
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
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${category === 'easy'
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillFramework;
