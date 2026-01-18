import React, { useState, useEffect } from 'react';
import { recommendationAPI, userAPI, frameworkAPI } from '../services/api';

const ProjectRecommendations = ({ skillsFromGapAnalysis = [], domain = '', autoFetch = false }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGaps, setLoadingGaps] = useState(true);
  const [error, setError] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(domain);
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [kValue, setKValue] = useState(5);
  const [stats, setStats] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('');

  const domains = [
    { value: '', label: 'All Domains' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'urban', label: 'Urban/Smart City' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'software-engineering', label: 'Software Engineering' },
  ];

  useEffect(() => {
    loadStats();
    loadFrameworks();
  }, []);

  useEffect(() => {
    if (skillsFromGapAnalysis.length > 0) {
      setSkillGaps(skillsFromGapAnalysis);
      setLoadingGaps(false);
      if (autoFetch) {
        fetchRecommendations(skillsFromGapAnalysis);
      }
    } else {
      loadUserGapAnalysis();
    }
  }, [skillsFromGapAnalysis, autoFetch]);

  useEffect(() => {
    if (domain) {
      setSelectedDomain(domain);
    }
  }, [domain]);

  const loadFrameworks = async () => {
    try {
      const response = await userAPI.getFrameworks({ limit: 50 });
      setFrameworks(response.data.frameworks || []);
    } catch (err) {
      console.error('Error loading frameworks:', err);
    }
  };

  const loadUserGapAnalysis = async () => {
    setLoadingGaps(true);
    try {
      const profileResponse = await userAPI.getProfile();
      const profile = profileResponse.data;
      
      if (profile.targetRole && profile.domain) {
        const frameworksResponse = await userAPI.getFrameworks({ 
          domain: profile.domain,
          limit: 10
        });
        
        const availableFrameworks = frameworksResponse.data.frameworks || [];
        
        if (availableFrameworks.length > 0) {
          const framework = availableFrameworks[0];
          setSelectedFramework(framework._id);
          
          const gapResponse = await userAPI.getSkillGap({
            frameworkId: framework._id,
            targetRole: profile.targetRole
          });
          
          if (gapResponse.data) {
            setGapAnalysis(gapResponse.data);
            
            const allMissingSkills = [];
            
            if (gapResponse.data.gapAnalysis?.hard?.missingSkills) {
              allMissingSkills.push(...gapResponse.data.gapAnalysis.hard.missingSkills.map(s => s.name));
            }
            if (gapResponse.data.gapAnalysis?.medium?.missingSkills) {
              allMissingSkills.push(...gapResponse.data.gapAnalysis.medium.missingSkills.map(s => s.name));
            }
            if (gapResponse.data.gapAnalysis?.easy?.missingSkills) {
              allMissingSkills.push(...gapResponse.data.gapAnalysis.easy.missingSkills.map(s => s.name));
            }
            
            if (allMissingSkills.length > 0) {
              setSkillGaps(allMissingSkills);
              setSelectedDomain(mapDomainToProject(profile.domain));
              fetchRecommendations(allMissingSkills);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading gap analysis:', err);
      setError('Could not load your skill gaps. Please complete Skill Gap Analysis first.');
    } finally {
      setLoadingGaps(false);
    }
  };

  const mapDomainToProject = (domain) => {
    const mapping = {
      'Healthcare': 'healthcare',
      'Agriculture': 'agriculture',
      'Urban Development': 'urban',
      'Web Development': 'web-development',
      'Data Science': 'data-science',
      'Cloud Computing': 'cloud-computing',
      'Mobile Development': 'mobile-development',
      'Cybersecurity': 'cybersecurity',
      'Software Engineering': 'software-engineering',
    };
    return mapping[domain] || '';
  };

  const loadStats = async () => {
    try {
      const response = await recommendationAPI.getProjectStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const fetchRecommendations = async (skills = null) => {
    const skillsToUse = skills || skillGaps;
    
    if (skillsToUse.length === 0) {
      setError('No skill gaps found. Please complete Skill Gap Analysis first.');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await recommendationAPI.getProjectRecommendations({
        missingSkills: skillsToUse,
        domain: selectedDomain || null,
        difficulty: selectedDifficulty,
        k: kValue,
      });

      setRecommendations(response.data.recommendations);
      setModelInfo(response.data.model_info);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleFrameworkChange = async (frameworkId) => {
    setSelectedFramework(frameworkId);
    if (!frameworkId) return;

    setLoadingGaps(true);
    try {
      const profileResponse = await userAPI.getProfile();
      const profile = profileResponse.data;

      const gapResponse = await userAPI.getSkillGap({
        frameworkId: frameworkId,
        targetRole: profile.targetRole || 'General'
      });

      if (gapResponse.data) {
        setGapAnalysis(gapResponse.data);
        
        const allMissingSkills = [];
        
        if (gapResponse.data.gapAnalysis?.hard?.missingSkills) {
          allMissingSkills.push(...gapResponse.data.gapAnalysis.hard.missingSkills.map(s => s.name));
        }
        if (gapResponse.data.gapAnalysis?.medium?.missingSkills) {
          allMissingSkills.push(...gapResponse.data.gapAnalysis.medium.missingSkills.map(s => s.name));
        }
        if (gapResponse.data.gapAnalysis?.easy?.missingSkills) {
          allMissingSkills.push(...gapResponse.data.gapAnalysis.easy.missingSkills.map(s => s.name));
        }
        
        setSkillGaps(allMissingSkills);
        
        if (allMissingSkills.length > 0) {
          fetchRecommendations(allMissingSkills);
        }
      }
    } catch (err) {
      console.error('Error loading framework gap analysis:', err);
    } finally {
      setLoadingGaps(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'hard': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'easy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">KNN Project Recommender</h2>
            <p className="text-white/80 text-sm">AI-powered project suggestions based on your skill gaps</p>
          </div>
        </div>
        {stats && (
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-white/70">Total Projects:</span> <span className="font-bold">{stats.total_projects}</span>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-white/70">Domains:</span> <span className="font-bold">{stats.domains?.length}</span>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-white/70">Algorithm:</span> <span className="font-bold">K-Nearest Neighbors</span>
            </div>
          </div>
        )}
      </div>

      {/* Skill Gaps Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🎯</span> Your Skill Gaps
          </h3>
          {gapAnalysis && (
            <span className="text-sm text-gray-500">
              {skillGaps.length} skills to develop
            </span>
          )}
        </div>

        {loadingGaps ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600">Loading your skill gaps...</span>
          </div>
        ) : skillGaps.length > 0 ? (
          <div className="space-y-4">
            {/* Skill Gap Tags */}
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((skill, idx) => {
                let priority = 'easy';
                if (gapAnalysis?.gapAnalysis?.hard?.missingSkills?.some(s => s.name === skill)) {
                  priority = 'hard';
                } else if (gapAnalysis?.gapAnalysis?.medium?.missingSkills?.some(s => s.name === skill)) {
                  priority = 'medium';
                }
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getPriorityColor(priority)}`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>

            {/* Gap Summary */}
            {gapAnalysis && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {gapAnalysis.gapAnalysis?.hard?.missingSkills?.length || 0}
                  </p>
                  <p className="text-xs text-red-700">High Priority</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {gapAnalysis.gapAnalysis?.medium?.missingSkills?.length || 0}
                  </p>
                  <p className="text-xs text-yellow-700">Medium Priority</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {gapAnalysis.gapAnalysis?.easy?.missingSkills?.length || 0}
                  </p>
                  <p className="text-xs text-green-700">Low Priority</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-600 font-medium mb-2">No skill gaps found</p>
            <p className="text-gray-500 text-sm mb-4">
              Complete the Skill Gap Analysis to get personalized project recommendations
            </p>
            <button
              onClick={() => window.location.hash = '#gap-analysis-config'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Go to Skill Gap Analysis
            </button>
          </div>
        )}
      </div>

      {/* Filters Section */}
      {skillGaps.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
              <select
                value={selectedFramework}
                onChange={(e) => handleFrameworkChange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-sm"
              >
                <option value="">Select Framework</option>
                {frameworks.map((f) => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain Filter</label>
              <select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  if (skillGaps.length > 0) fetchRecommendations();
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-sm"
              >
                {domains.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  if (skillGaps.length > 0) fetchRecommendations();
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">K Value</label>
              <select
                value={kValue}
                onChange={(e) => {
                  setKValue(parseInt(e.target.value));
                  if (skillGaps.length > 0) fetchRecommendations();
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-sm"
              >
                <option value={3}>3 Projects</option>
                <option value={5}>5 Projects</option>
                <option value={10}>10 Projects</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => fetchRecommendations()}
            disabled={loading || skillGaps.length === 0}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Running KNN...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Refresh Recommendations</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Model Info */}
      {modelInfo && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
            <span>📊</span> KNN Model Details
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <p className="text-gray-500 text-xs">Feature Dimensions</p>
              <p className="font-bold text-indigo-700">{modelInfo.feature_dimensions}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <p className="text-gray-500 text-xs">Skill Vocabulary</p>
              <p className="font-bold text-indigo-700">{modelInfo.skill_vocabulary_size}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <p className="text-gray-500 text-xs">Distance Metric</p>
              <p className="font-bold text-indigo-700 capitalize">{modelInfo.distance_metric}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <p className="text-gray-500 text-xs">Similarity Metric</p>
              <p className="font-bold text-indigo-700 capitalize">{modelInfo.similarity_metric}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(modelInfo.weights).map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                {key.replace(/_/g, ' ')}: {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🎯</span> Top {recommendations.length} Recommended Projects
          </h3>

          {recommendations.map((project, index) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </span>
                      <h4 className="text-lg font-bold text-gray-800">{project.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {project.domain.replace(/-/g, ' ')}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {project.duration_weeks} weeks
                      </span>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 px-3 py-2 rounded-r text-sm text-green-800">
                      💡 {project.why_recommended}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className={`text-3xl font-bold ${getMatchColor(project.match_percentage)}`}>
                      {project.match_percentage}%
                    </div>
                    <p className="text-xs text-gray-500">Match Score</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Gap Coverage: {project.gap_coverage}%
                    </div>
                  </div>
                </div>
              </div>

              {expandedProject === project.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>📚</span> Skills You'll Learn
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_taught.map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              project.gaps_addressed.some(g => g.toLowerCase() === skill.toLowerCase())
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {skill}
                            {project.gaps_addressed.some(g => g.toLowerCase() === skill.toLowerCase()) && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>🎯</span> Your Gaps Addressed
                      </h5>
                      {project.gaps_addressed.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {project.gaps_addressed.map((gap, idx) => (
                            <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-medium">
                              {gap}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">General skill development</p>
                      )}
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>🏆</span> Project Outcomes
                      </h5>
                      <ul className="space-y-1">
                        {project.outcomes.map((outcome, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>📊</span> Score Breakdown
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Similarity Score</span>
                          <span className="font-medium">{project.score_breakdown.similarity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${project.score_breakdown.similarity}%` }}></div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Gap Coverage</span>
                          <span className="font-medium">{project.score_breakdown.gap_coverage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${project.score_breakdown.gap_coverage}%` }}></div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Difficulty Match</span>
                          <span className="font-medium">{project.score_breakdown.difficulty_match}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${project.score_breakdown.difficulty_match}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>📖</span> Recommended Resources
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {project.resources.map((resource, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Running KNN Algorithm...</p>
          <p className="text-gray-500 text-sm">Finding the best projects for your skill gaps</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !loadingGaps && recommendations.length === 0 && skillGaps.length > 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <p className="text-gray-600 font-medium mb-2">No projects found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ProjectRecommendations;
