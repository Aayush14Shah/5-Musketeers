import React, { useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { authHelpers } from '../services/api';

const UserDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [frameworks, setFrameworks] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    try {
      setLoadingFrameworks(true);
      const response = await userAPI.getFrameworks();
      setFrameworks(response.data);
    } catch (error) {
      console.error('Error loading frameworks:', error);
    } finally {
      setLoadingFrameworks(false);
    }
  };

  const handleAnalyzeGap = async () => {
    if (!selectedRole) {
      setError('Please select a role to analyze');
      return;
    }

    setAnalyzing(true);
    setError('');
    setGapAnalysis(null);

    try {
      const response = await userAPI.getSkillGap({ roleId: selectedRole });
      setGapAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing skill gap:', err);
      setError(err.response?.data?.message || 'Failed to analyze skill gap');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setUser(response.data.user);
      setProfile(response.data.profile);
    } catch (err) {
      console.error('Error loading profile:', err);
      // If API fails, use stored user data
      const { user: storedUser } = authHelpers.getAuth();
      if (storedUser) {
        setUser(storedUser);
      } else {
        setError('Failed to load profile. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDomainDisplayName = (domain) => {
    if (!domain) return 'Not selected';
    // Capitalize first letter and replace underscores with spaces
    return domain
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const skillsCount = profile?.skills?.length || 0;
  const projectsCount = profile?.projects?.length || 0;

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'job-role-management', icon: '💼', label: 'Job Role Management' },
    { id: 'skill-framework', icon: '🎯', label: 'Skill Framework' },
    { id: 'role-skill-mapping', icon: '🔗', label: 'Role-Skill Mapping' },
    { id: 'gap-analysis-config', icon: '📈', label: 'Gap Analysis Config' },
    { id: 'recommendations', icon: '💡', label: 'Recommendations' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-800 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                SS
              </div>
              <span className="ml-3 text-lg font-bold text-gray-800">SkillSphere</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto">
              SS
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="ml-3 text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl">{sidebarCollapsed ? '→' : '←'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-gray-500">Welcome back, {user?.name || 'User'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-xl">🔔</span>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-xl">💬</span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-500">{user?.email || ''}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name || 'User'}! 👋
                </h2>
                <p className="text-indigo-100 text-lg">
                  Continue your skill development journey and explore new opportunities.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Domain of Interest</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {getDomainDisplayName(user?.domainInterest)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Skills Added</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{skillsCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💼</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Projects</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{projectsCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-base text-gray-800 mt-1">{user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email Address</label>
                      <p className="text-base text-gray-800 mt-1">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Account Type</label>
                      <p className="text-base text-gray-800 mt-1 capitalize">{user?.role || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Member Since</label>
                      <p className="text-base text-gray-800 mt-1">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Your Skills</h3>
                    {skillsCount === 0 && (
                      <span className="text-sm text-gray-500">No skills added yet</span>
                    )}
                  </div>
                  {skillsCount > 0 ? (
                    <div className="space-y-3">
                      {profile.skills.slice(0, 5).map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="font-medium text-gray-800">{skill.name}</span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium capitalize">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                      {skillsCount > 5 && (
                        <p className="text-sm text-gray-500 text-center mt-2">
                          +{skillsCount - 5} more skills
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Start building your skills profile!</p>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Add Skills
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Projects */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Recent Projects</h3>
                    {projectsCount === 0 && (
                      <span className="text-sm text-gray-500">No projects yet</span>
                    )}
                  </div>
                  {projectsCount > 0 ? (
                    <div className="space-y-3">
                      {profile.projects.slice(0, 3).map((project, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-1">{project.title}</h4>
                          {project.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {projectsCount > 3 && (
                        <p className="text-sm text-gray-500 text-center mt-2">
                          +{projectsCount - 3} more projects
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Showcase your work and projects!</p>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Add Project
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-left font-medium border border-gray-200">
                      📚 Browse Learning Resources
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-left font-medium border border-gray-200">
                      ✏️ Edit Profile
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-left font-medium border border-gray-200">
                      🔍 Explore Opportunities
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Role Management Tab */}
          {activeTab === 'job-role-management' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Job Role Management</h2>
              <p className="text-gray-600 mb-6">
                Explore available job roles and their requirements.
              </p>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <span className="text-6xl mb-4 block">💼</span>
                <p className="text-gray-500">Job Role Management interface coming soon...</p>
              </div>
            </div>
          )}

          {/* Skill Framework Tab */}
          {activeTab === 'skill-framework' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Framework</h2>
              <p className="text-gray-600 mb-6">
                Browse skill frameworks for different job roles.
              </p>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <span className="text-6xl mb-4 block">🎯</span>
                <p className="text-gray-500">Skill Framework interface coming soon...</p>
              </div>
            </div>
          )}

          {/* Role-Skill Mapping Tab */}
          {activeTab === 'role-skill-mapping' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Role-Skill Mapping</h2>
              <p className="text-gray-600 mb-6">
                View how your skills map to different job roles.
              </p>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <span className="text-6xl mb-4 block">🔗</span>
                <p className="text-gray-500">Role-Skill Mapping interface coming soon...</p>
              </div>
            </div>
          )}

          {/* Gap Analysis Config Tab */}
          {activeTab === 'gap-analysis-config' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Gap Analysis</h2>
              <p className="text-sm text-gray-600 mb-4">
                Compare your skills with job role requirements to identify what you need to learn.
              </p>

              {/* Role Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Target Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm bg-white"
                  disabled={loadingFrameworks}
                >
                  <option value="">Choose a role...</option>
                  {frameworks.map((framework) => (
                    <option key={framework._id} value={framework._id}>
                      {framework.roleName} ({framework.domain.replace(/-/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAnalyzeGap}
                disabled={!selectedRole || analyzing}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Skill Gap'}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Gap Analysis Results */}
              {gapAnalysis && (
                <div className="mt-6 space-y-4">
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                    <h4 className="text-lg font-bold mb-2">Analysis Results</h4>
                    <p className="text-indigo-100 mb-4">{gapAnalysis.summaryMessage}</p>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-bold">{gapAnalysis.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-indigo-800 rounded-full h-3">
                        <div
                          className="bg-white h-3 rounded-full transition-all duration-500"
                          style={{ width: `${gapAnalysis.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{gapAnalysis.userHasSkills}</div>
                        <div className="text-xs text-indigo-200">Skills You Have</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{gapAnalysis.missingSkills}</div>
                        <div className="text-xs text-indigo-200">Missing Skills</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{gapAnalysis.totalRequiredSkills}</div>
                        <div className="text-xs text-indigo-200">Total Required</div>
                      </div>
                    </div>
                  </div>

                  {/* Missing Skills by Category */}
                  {(gapAnalysis.gapAnalysis.hard.missing > 0 ||
                    gapAnalysis.gapAnalysis.medium.missing > 0 ||
                    gapAnalysis.gapAnalysis.easy.missing > 0) && (
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-800">Missing Skills Breakdown:</h5>

                        {/* Hard Skills */}
                        {gapAnalysis.gapAnalysis.hard.missing > 0 && (
                          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-semibold text-red-800">
                                Hard Skills ({gapAnalysis.gapAnalysis.hard.missing})
                              </h6>
                              <span className="text-xs text-red-600">High Priority</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gapAnalysis.gapAnalysis.hard.missingSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium border border-red-300"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Medium Skills */}
                        {gapAnalysis.gapAnalysis.medium.missing > 0 && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-semibold text-yellow-800">
                                Medium Skills ({gapAnalysis.gapAnalysis.medium.missing})
                              </h6>
                              <span className="text-xs text-yellow-600">Medium Priority</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gapAnalysis.gapAnalysis.medium.missingSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium border border-yellow-300"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Easy Skills */}
                        {gapAnalysis.gapAnalysis.easy.missing > 0 && (
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-semibold text-green-800">
                                Easy Skills ({gapAnalysis.gapAnalysis.easy.missing})
                              </h6>
                              <span className="text-xs text-green-600">Low Priority</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gapAnalysis.gapAnalysis.easy.missingSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-300"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Recommendations */}
                  {gapAnalysis.recommendations && gapAnalysis.recommendations.length > 0 && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h5 className="font-semibold text-blue-800 mb-2">Recommendations:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                        {gapAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Success Message */}
                  {gapAnalysis.missingSkills === 0 && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-800 font-semibold">
                        🎉 Excellent! You have all the required skills for this role!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h2>
              <p className="text-gray-600 mb-6">
                Get personalized recommendations for your skill development journey.
              </p>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <span className="text-6xl mb-4 block">💡</span>
                <p className="text-gray-500">Recommendations interface coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
