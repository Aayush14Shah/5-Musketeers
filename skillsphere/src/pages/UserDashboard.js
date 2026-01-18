import React, { useState, useEffect } from 'react';
import { authAPI, userAPI, frameworkAPI } from '../services/api';
import { authHelpers } from '../services/api';
import MLRecommendation from './admin/MLRecommendation';
import RoadmapView from './RoadmapView';

const UserDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [frameworks, setFrameworks] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
  const [domainSkills, setDomainSkills] = useState(null);
  const [loadingDomainSkills, setLoadingDomainSkills] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [savingSkills, setSavingSkills] = useState(false);
  const [selectedRoleForSkills, setSelectedRoleForSkills] = useState('');
  const [roleFrameworks, setRoleFrameworks] = useState([]);
  const [loadingRoleFrameworks, setLoadingRoleFrameworks] = useState(false);
  const [markingComplete, setMarkingComplete] = useState({}); // Track which skills are being marked complete
  const [skillsForCourses, setSkillsForCourses] = useState([]); // Skills to pass to course finder

  useEffect(() => {
    loadUserProfile();
    loadFrameworks(); // Load all frameworks initially to get domains

    // Load persisted gap analysis data
    loadPersistedGapAnalysis();
  }, []);

  // Helper functions for persisting gap analysis
  const saveGapAnalysisToStorage = (analysis, domain, role) => {
    try {
      const dataToSave = {
        gapAnalysis: analysis,
        selectedDomain: domain,
        selectedRole: role,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('skillGapAnalysis', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving gap analysis to storage:', error);
    }
  };

  const loadPersistedGapAnalysis = () => {
    try {
      const saved = localStorage.getItem('skillGapAnalysis');
      if (saved) {
        const data = JSON.parse(saved);
        // Only restore if data is recent (within 7 days)
        const savedDate = new Date(data.timestamp);
        const daysDiff = (new Date() - savedDate) / (1000 * 60 * 60 * 24);

        if (daysDiff < 7) {
          setGapAnalysis(data.gapAnalysis);
          setSelectedDomain(data.selectedDomain || '');
          setSelectedRole(data.selectedRole || '');

          // If domain is set, load frameworks for that domain
          if (data.selectedDomain) {
            loadFrameworks(data.selectedDomain);
          }
        } else {
          // Clear old data
          localStorage.removeItem('skillGapAnalysis');
        }
      }
    } catch (error) {
      console.error('Error loading persisted gap analysis:', error);
      localStorage.removeItem('skillGapAnalysis');
    }
  };

  const clearPersistedGapAnalysis = () => {
    localStorage.removeItem('skillGapAnalysis');
  };

  const loadFrameworks = async (domain = null) => {
    try {
      setLoadingFrameworks(true);

      // Always load all frameworks first to get domains list
      const allFrameworksResponse = await userAPI.getFrameworks();
      const uniqueDomains = [...new Set(allFrameworksResponse.data.map(fw => fw.domain))].sort();
      setAvailableDomains(uniqueDomains);

      // If domain is specified, filter frameworks
      if (domain) {
        const filteredFrameworks = allFrameworksResponse.data.filter(fw => fw.domain === domain);
        setFrameworks(filteredFrameworks);
      } else {
        // If no domain selected, show all frameworks
        setFrameworks(allFrameworksResponse.data);
      }
    } catch (error) {
      console.error('Error loading frameworks:', error);
    } finally {
      setLoadingFrameworks(false);
    }
  };

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setSelectedRole(''); // Reset role when domain changes
    setGapAnalysis(null); // Clear previous analysis
    clearPersistedGapAnalysis(); // Clear persisted data when domain changes
    if (domain) {
      loadFrameworks(domain);
    } else {
      loadFrameworks(); // Load all if no domain selected
    }
  };

  const handleOpenAddSkills = async () => {
    if (!user?.domainInterest) {
      setError('Please select a domain of interest in your profile first');
      return;
    }

    setShowAddSkillsModal(true);
    setSelectedRoleForSkills('');
    setDomainSkills(null);
    setSelectedSkills(profile?.skills || []);
    setLoadingRoleFrameworks(true);

    try {
      // Load all roles/frameworks for user's domain
      const response = await userAPI.getFrameworks({ domain: user.domainInterest });
      setRoleFrameworks(response.data);
    } catch (err) {
      console.error('Error loading role frameworks:', err);
      setError('Failed to load roles for your domain');
    } finally {
      setLoadingRoleFrameworks(false);
    }
  };

  const handleRoleSelectForSkills = async (roleId) => {
    setSelectedRoleForSkills(roleId);
    setDomainSkills(null);
    setLoadingDomainSkills(true);
    setError('');
    setSelectedSkills([]); // Reset selected skills when changing role

    try {
      // Get the specific framework/role with all skills
      const frameworkDetails = await frameworkAPI.getFramework(roleId);

      if (frameworkDetails.data) {
        const framework = frameworkDetails.data;

        // Extract skills from this specific role
        const roleSkills = framework.skills || [];

        // Group skills by category
        const skillsByCategory = {
          easy: roleSkills.filter(s => s.category === 'easy').sort((a, b) => a.name.localeCompare(b.name)),
          medium: roleSkills.filter(s => s.category === 'medium').sort((a, b) => a.name.localeCompare(b.name)),
          hard: roleSkills.filter(s => s.category === 'hard').sort((a, b) => a.name.localeCompare(b.name)),
        };

        setDomainSkills({
          roleName: framework.roleName,
          domain: framework.domain,
          totalSkills: roleSkills.length,
          skillsByCategory,
        });
      }
    } catch (err) {
      console.error('Error loading role skills:', err);
      setError(err.response?.data?.message || 'Failed to load skills for selected role');
    } finally {
      setLoadingDomainSkills(false);
    }
  };

  const handleToggleSkill = (skillName, category) => {
    setSelectedSkills((prev) => {
      const existingIndex = prev.findIndex(s => s.name.toLowerCase() === skillName.toLowerCase());

      if (existingIndex >= 0) {
        // Remove skill if already selected
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add skill with default level based on category
        let defaultLevel = 'beginner';
        if (category === 'medium') defaultLevel = 'intermediate';
        if (category === 'hard') defaultLevel = 'advanced';

        return [...prev, { name: skillName, level: defaultLevel }];
      }
    });
  };

  const handleSkillLevelChange = (skillName, newLevel) => {
    setSelectedSkills((prev) =>
      prev.map((skill) =>
        skill.name.toLowerCase() === skillName.toLowerCase()
          ? { ...skill, level: newLevel }
          : skill
      )
    );
  };

  const handleSaveSkills = async () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    if (!selectedRoleForSkills) {
      setError('Please select a role first');
      return;
    }

    setSavingSkills(true);
    setError('');

    try {
      // Get selected role name for context
      const selectedFramework = roleFrameworks.find(fw => fw._id === selectedRoleForSkills);
      const roleName = selectedFramework?.roleName || 'Unknown Role';

      // Add role context to skills (optional - you can store this if needed)
      const skillsWithRole = selectedSkills.map(skill => ({
        ...skill,
        role: roleName, // Store which role this skill is for
      }));

      await userAPI.updateSkills(skillsWithRole);
      await loadUserProfile(); // Reload profile to show updated skills
      setShowAddSkillsModal(false);
      setSelectedSkills([]);
      setSelectedRoleForSkills('');
      setDomainSkills(null);
      setRoleFrameworks([]);
    } catch (err) {
      console.error('Error saving skills:', err);
      setError(err.response?.data?.message || 'Failed to save skills');
    } finally {
      setSavingSkills(false);
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
      const analysisData = response.data;
      setGapAnalysis(analysisData);

      // Save to localStorage for persistence
      saveGapAnalysisToStorage(analysisData, selectedDomain, selectedRole);
    } catch (err) {
      console.error('Error analyzing skill gap:', err);
      setError(err.response?.data?.message || 'Failed to analyze skill gap');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMarkSkillComplete = async (skillName, category) => {
    const skillKey = `${category}-${skillName}`;

    // Check if already marking this skill
    if (markingComplete[skillKey]) return;

    setMarkingComplete(prev => ({ ...prev, [skillKey]: true }));
    setError('');

    try {
      // Get current skills from profile
      const currentSkills = profile?.skills || [];

      // Check if skill already exists
      const skillExists = currentSkills.some(
        s => s.name.toLowerCase() === skillName.toLowerCase()
      );

      let updatedSkills;
      if (skillExists) {
        // Skill already exists, just update the list (no duplicate)
        updatedSkills = currentSkills;
      } else {
        // Add new skill with appropriate default level based on category
        let defaultLevel = 'beginner';
        if (category === 'medium') defaultLevel = 'intermediate';
        if (category === 'hard') defaultLevel = 'advanced';

        updatedSkills = [
          ...currentSkills,
          { name: skillName, level: defaultLevel }
        ];
      }

      // Update skills in backend
      await userAPI.updateSkills(updatedSkills);

      // Reload profile to get updated skills
      await loadUserProfile();

      // Re-run gap analysis to update results
      if (selectedRole) {
        const response = await userAPI.getSkillGap({ roleId: selectedRole });
        const updatedAnalysis = response.data;
        setGapAnalysis(updatedAnalysis);

        // Update persisted data
        saveGapAnalysisToStorage(updatedAnalysis, selectedDomain, selectedRole);
      }
    } catch (err) {
      console.error('Error marking skill complete:', err);
      setError(err.response?.data?.message || 'Failed to mark skill as complete');
    } finally {
      setMarkingComplete(prev => {
        const newState = { ...prev };
        delete newState[skillKey];
        return newState;
      });
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

  const handleTabChange = (tabId) => {
    if (tabId !== 'ml-recommendation') {
      setSkillsForCourses([]);
    }
    setActiveTab(tabId);
  };

  const handleFindCoursesForMissingSkills = () => {
    if (!gapAnalysis) return;

    const allMissingSkills = [
      ...gapAnalysis.gapAnalysis.hard.missingSkills.map(s => s.name),
      ...gapAnalysis.gapAnalysis.medium.missingSkills.map(s => s.name),
      ...gapAnalysis.gapAnalysis.easy.missingSkills.map(s => s.name),
    ];

    setSkillsForCourses(allMissingSkills);
    setActiveTab('ml-recommendation');
  };

  const skillsCount = profile?.skills?.length || 0;
  const projectsCount = profile?.projects?.length || 0;

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'gap-analysis-config', icon: '📈', label: 'Skill Gap Analysis' },
    { id: 'recommendations', icon: '💡', label: 'Recommendations' },
    { id: 'ml-recommendation', icon: '🤖', label: 'Course Finder' },
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
                onClick={() => handleTabChange(item.id)}
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
              {/* Welcome Banner with Quick Stats */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {getDomainDisplayName(user?.domainInterest)} Enthusiast
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Track your progress, develop new skills, and achieve your career goals.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/30">
                      <p className="text-white/70 text-xs uppercase tracking-wider">Skills</p>
                      <p className="text-2xl font-bold">{skillsCount}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/30">
                      <p className="text-white/70 text-xs uppercase tracking-wider">Projects</p>
                      <p className="text-2xl font-bold">{projectsCount}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/30">
                      <p className="text-white/70 text-xs uppercase tracking-wider">Domain</p>
                      <p className="text-lg font-bold">{getDomainDisplayName(user?.domainInterest)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Skills & Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Skills Section - Primary Focus */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Your Skills</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{skillsCount} skills in your profile</p>
                        </div>
                        <button
                          onClick={() => handleOpenAddSkills()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          + Add Skills
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {skillsCount > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {profile.skills.slice(0, 6).map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                  <span className="text-indigo-600 font-bold text-sm">{skill.name.charAt(0)}</span>
                                </div>
                                <span className="font-medium text-gray-800">{skill.name}</span>
                              </div>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${skill.level === 'expert' ? 'bg-purple-100 text-purple-700' :
                                skill.level === 'advanced' ? 'bg-green-100 text-green-700' :
                                  skill.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                {skill.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🎯</span>
                          </div>
                          <p className="text-gray-600 font-medium mb-2">No skills added yet</p>
                          <p className="text-gray-500 text-sm mb-4">Start building your skills profile to track your progress</p>
                          <button
                            onClick={() => handleOpenAddSkills()}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            Add Your First Skill
                          </button>
                        </div>
                      )}
                      {skillsCount > 6 && (
                        <button className="w-full mt-4 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200">
                          View All {skillsCount} Skills
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Recent Projects */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Recent Projects</h3>
                          <p className="text-sm text-gray-500 mt-0.5">Showcase your work</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium">
                          + Add Project
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {projectsCount > 0 ? (
                        <div className="space-y-4">
                          {profile.projects.slice(0, 3).map((project, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
                                  🚀
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-800 mb-1">{project.title}</h4>
                                  {project.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                      {project.description}
                                    </p>
                                  )}
                                  {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                                        <span
                                          key={techIndex}
                                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium"
                                        >
                                          {tech}
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
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🚀</span>
                          </div>
                          <p className="text-gray-600 font-medium mb-2">No projects yet</p>
                          <p className="text-gray-500 text-sm mb-4">Showcase your work to stand out</p>
                          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                            Add Your First Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Quick Actions & Profile Summary */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => setActiveTab('gap-analysis-config')}
                        className="w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all text-left font-medium border border-indigo-100"
                      >
                        <span className="text-xl">📈</span>
                        <div>
                          <p className="font-semibold">Skill Gap Analysis</p>
                          <p className="text-xs text-indigo-500 font-normal">Find skills to learn</p>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all text-left font-medium border border-gray-100">
                        <span className="text-xl">📚</span>
                        <div>
                          <p className="font-semibold">Learning Resources</p>
                          <p className="text-xs text-gray-500 font-normal">Browse courses & tutorials</p>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all text-left font-medium border border-gray-100">
                        <span className="text-xl">🔍</span>
                        <div>
                          <p className="font-semibold">Explore Opportunities</p>
                          <p className="text-xs text-gray-500 font-normal">Discover career paths</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Profile Card - Compact */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Profile</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Edit</button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Account Type</span>
                          <span className="font-medium text-gray-800 capitalize px-2.5 py-1 bg-gray-100 rounded-lg">{user?.role || 'User'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Domain</span>
                          <span className="font-medium text-gray-800">{getDomainDisplayName(user?.domainInterest)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Member Since</span>
                          <span className="font-medium text-gray-800">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Card */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
                    <h4 className="font-bold mb-3">Your Progress</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/80">Profile Completion</span>
                          <span className="font-bold">{Math.min(100, Math.round((skillsCount + projectsCount + (user?.domainInterest ? 1 : 0)) / 5 * 100))}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-white h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.round((skillsCount + projectsCount + (user?.domainInterest ? 1 : 0)) / 5 * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-white/70">
                        {skillsCount === 0 ? 'Add skills to improve your profile' :
                          projectsCount === 0 ? 'Add projects to showcase your work' :
                            'Great progress! Keep building your profile'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gap Analysis Tab */}
          {activeTab === 'gap-analysis-config' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Gap Analysis</h2>
              <p className="text-sm text-gray-600 mb-4">
                Compare your skills with job role requirements to identify what you need to learn.
              </p>

              {/* Domain/Category Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step 1: Select Domain/Category
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm bg-white"
                  disabled={loadingFrameworks}
                >
                  <option value="">All Domains</option>
                  {availableDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step 2: Select Target Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    // Clear gap analysis when role changes (unless it's the same role)
                    if (newRole !== selectedRole) {
                      setGapAnalysis(null);
                      clearPersistedGapAnalysis();
                    }
                    setSelectedRole(newRole);
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm bg-white"
                  disabled={loadingFrameworks || !selectedDomain}
                >
                  <option value="">
                    {selectedDomain
                      ? `Choose a role in ${selectedDomain.replace(/-/g, ' ')}...`
                      : 'First select a domain...'}
                  </option>
                  {frameworks.map((framework) => (
                    <option key={framework._id} value={framework._id}>
                      {framework.roleName}
                    </option>
                  ))}
                </select>
                {selectedDomain && frameworks.length === 0 && !loadingFrameworks && (
                  <p className="text-sm text-gray-500 mt-2">
                    No roles found in this domain.
                  </p>
                )}
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
                              {gapAnalysis.gapAnalysis.hard.missingSkills.map((skill, idx) => {
                                const skillKey = `hard-${skill.name}`;
                                const isMarking = markingComplete[skillKey];
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium border border-red-300"
                                  >
                                    <span>{skill.name}</span>
                                    <button
                                      onClick={() => handleMarkSkillComplete(skill.name, 'hard')}
                                      disabled={isMarking}
                                      className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold transition-all ${isMarking
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                      title="Mark as complete"
                                    >
                                      {isMarking ? '✓' : '✓ Complete'}
                                    </button>
                                  </div>
                                );
                              })}
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
                              {gapAnalysis.gapAnalysis.medium.missingSkills.map((skill, idx) => {
                                const skillKey = `medium-${skill.name}`;
                                const isMarking = markingComplete[skillKey];
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium border border-yellow-300"
                                  >
                                    <span>{skill.name}</span>
                                    <button
                                      onClick={() => handleMarkSkillComplete(skill.name, 'medium')}
                                      disabled={isMarking}
                                      className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold transition-all ${isMarking
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                      title="Mark as complete"
                                    >
                                      {isMarking ? '✓' : '✓ Complete'}
                                    </button>
                                  </div>
                                );
                              })}
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
                              {gapAnalysis.gapAnalysis.easy.missingSkills.map((skill, idx) => {
                                const skillKey = `easy-${skill.name}`;
                                const isMarking = markingComplete[skillKey];
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-300"
                                  >
                                    <span>{skill.name}</span>
                                    <button
                                      onClick={() => handleMarkSkillComplete(skill.name, 'easy')}
                                      disabled={isMarking}
                                      className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold transition-all ${isMarking
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                      title="Mark as complete"
                                    >
                                      {isMarking ? '✓' : '✓ Complete'}
                                    </button>
                                  </div>
                                );
                              })}
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

                  {/* Find Courses Button */}
                  {gapAnalysis.missingSkills > 0 && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-indigo-800 mb-1">Ready to Learn?</h5>
                          <p className="text-sm text-indigo-600">
                            Find courses for your {gapAnalysis.missingSkills} missing skill{gapAnalysis.missingSkills > 1 ? 's' : ''}
                          </p>
                        </div>
                        <button
                          onClick={handleFindCoursesForMissingSkills}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Find Courses
                        </button>
                      </div>
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
            <RoadmapView
              availableDomains={availableDomains}
              frameworks={frameworks}
              initialRole={frameworks.find(f => f._id === selectedRole)?.roleName || ''}
              initialMissingSkills={
                gapAnalysis
                  ? [
                    ...gapAnalysis.gapAnalysis.hard.missingSkills.map(s => s.name),
                    ...gapAnalysis.gapAnalysis.medium.missingSkills.map(s => s.name),
                    ...gapAnalysis.gapAnalysis.easy.missingSkills.map(s => s.name)
                  ].join(', ')
                  : ''
              }
            />
          )}

          {/* Course Finder (ML Recommendation) Tab */}
          {activeTab === 'ml-recommendation' && (
            <MLRecommendation
              skillsFromGapAnalysis={skillsForCourses}
              autoFetch={skillsForCourses.length > 0}
            />
          )}
        </main>
      </div>

      {/* Add Skills Modal */}
      {showAddSkillsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Add Skills</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Domain: <span className="font-semibold capitalize">{user?.domainInterest?.replace(/-/g, ' ')}</span>
                  {domainSkills && ` • Role: ${domainSkills.roleName}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddSkillsModal(false);
                  setSelectedSkills([]);
                  setSelectedRoleForSkills('');
                  setDomainSkills(null);
                  setRoleFrameworks([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Select Role */}
              {!selectedRoleForSkills && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select a Role</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose a role to see the skills required for that position.
                  </p>

                  {loadingRoleFrameworks ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="mt-2 text-gray-500">Loading roles...</p>
                    </div>
                  ) : roleFrameworks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No roles found for your domain.</p>
                      <p className="text-sm text-gray-400 mt-2">Please contact admin to upload job data.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {roleFrameworks.map((framework) => (
                        <button
                          key={framework._id}
                          onClick={() => handleRoleSelectForSkills(framework._id)}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                        >
                          <h5 className="font-semibold text-gray-800 mb-1">{framework.roleName}</h5>
                          <p className="text-xs text-gray-500">
                            {framework.totalSkills || 0} skills required
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Select Skills for Selected Role */}
              {selectedRoleForSkills && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Step 2: Select Skills</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Select skills you have for: <span className="font-semibold">{domainSkills?.roleName}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRoleForSkills('');
                        setDomainSkills(null);
                        setSelectedSkills([]);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      ← Change Role
                    </button>
                  </div>

                  {loadingDomainSkills ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="mt-2 text-gray-500">Loading skills...</p>
                    </div>
                  ) : domainSkills && domainSkills.skillsByCategory ? (
                    <div className="space-y-6">
                      {/* Easy Skills */}
                      {domainSkills.skillsByCategory.easy.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            Easy Skills ({domainSkills.skillsByCategory.easy.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {domainSkills.skillsByCategory.easy.map((skill) => {
                              const isSelected = selectedSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
                              const selectedSkill = selectedSkills.find(s => s.name.toLowerCase() === skill.name.toLowerCase());
                              return (
                                <div
                                  key={skill.name}
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                  onClick={() => handleToggleSkill(skill.name, skill.category)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-800">{skill.name}</span>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleSkill(skill.name, skill.category)}
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  {isSelected && (
                                    <select
                                      value={selectedSkill?.level || 'beginner'}
                                      onChange={(e) => handleSkillLevelChange(skill.name, e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                    >
                                      <option value="beginner">Beginner</option>
                                      <option value="intermediate">Intermediate</option>
                                      <option value="advanced">Advanced</option>
                                      <option value="expert">Expert</option>
                                    </select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Medium Skills */}
                      {domainSkills.skillsByCategory.medium.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                            Medium Skills ({domainSkills.skillsByCategory.medium.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {domainSkills.skillsByCategory.medium.map((skill) => {
                              const isSelected = selectedSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
                              const selectedSkill = selectedSkills.find(s => s.name.toLowerCase() === skill.name.toLowerCase());
                              return (
                                <div
                                  key={skill.name}
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                  onClick={() => handleToggleSkill(skill.name, skill.category)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-800">{skill.name}</span>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleSkill(skill.name, skill.category)}
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  {isSelected && (
                                    <select
                                      value={selectedSkill?.level || 'intermediate'}
                                      onChange={(e) => handleSkillLevelChange(skill.name, e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                    >
                                      <option value="beginner">Beginner</option>
                                      <option value="intermediate">Intermediate</option>
                                      <option value="advanced">Advanced</option>
                                      <option value="expert">Expert</option>
                                    </select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Hard Skills */}
                      {domainSkills.skillsByCategory.hard.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            Hard Skills ({domainSkills.skillsByCategory.hard.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {domainSkills.skillsByCategory.hard.map((skill) => {
                              const isSelected = selectedSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
                              const selectedSkill = selectedSkills.find(s => s.name.toLowerCase() === skill.name.toLowerCase());
                              return (
                                <div
                                  key={skill.name}
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                  onClick={() => handleToggleSkill(skill.name, skill.category)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-800">{skill.name}</span>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleSkill(skill.name, skill.category)}
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  {isSelected && (
                                    <select
                                      value={selectedSkill?.level || 'advanced'}
                                      onChange={(e) => handleSkillLevelChange(skill.name, e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                    >
                                      <option value="beginner">Beginner</option>
                                      <option value="intermediate">Intermediate</option>
                                      <option value="advanced">Advanced</option>
                                      <option value="expert">Expert</option>
                                    </select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {domainSkills.totalSkills === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No skills found for this role.</p>
                        </div>
                      )}

                      {/* Selected Skills Summary */}
                      {selectedSkills.length > 0 && (
                        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <p className="text-sm font-semibold text-indigo-800 mb-2">
                            Selected Skills ({selectedSkills.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium"
                              >
                                {skill.name} ({skill.level})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {error && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
                          {error}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Unable to load skills. Please try again.</p>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons - Only show when role is selected */}
              {selectedRoleForSkills && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedRoleForSkills('');
                      setDomainSkills(null);
                      setSelectedSkills([]);
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Back to Roles
                  </button>
                  <button
                    onClick={handleSaveSkills}
                    disabled={selectedSkills.length === 0 || savingSkills}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingSkills ? 'Saving...' : `Save ${selectedSkills.length} Skill${selectedSkills.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
