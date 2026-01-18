import React, { useState, useEffect } from 'react';

const AdminLayout = ({
  children,
  activeTab,
  setActiveTab,
  onLogout,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('adminDarkMode') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    localStorage.setItem('adminDarkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const searchableItems = [
    { id: 'dashboard', label: 'Dashboard', keywords: ['home', 'overview', 'stats', 'dashboard'], tab: 'dashboard' },
    { id: 'job-role-management', label: 'Job Role Management', keywords: ['job', 'role', 'career', 'position', 'management'], tab: 'job-role-management' },
    { id: 'skill-framework', label: 'Skill Framework', keywords: ['skill', 'framework', 'competency', 'ability'], tab: 'skill-framework' },
    { id: 'role-skill-mapping', label: 'Role-Skill Mapping', keywords: ['mapping', 'role', 'skill', 'link', 'connect'], tab: 'role-skill-mapping' },
    { id: 'gap-analysis-config', label: 'Gap Analysis Config', keywords: ['gap', 'analysis', 'config', 'configuration', 'settings'], tab: 'gap-analysis-config' },
    { id: 'recommendations', label: 'Recommendations', keywords: ['recommendation', 'suggest', 'course', 'learning'], tab: 'recommendations' },
    { id: 'analysis', label: 'Analysis', keywords: ['analysis', 'report', 'analytics', 'insights', 'data'], tab: 'analysis' },
    { id: 'add-job', label: 'Add New Job Role', keywords: ['add', 'new', 'job', 'create', 'role'], tab: 'job-role-management' },
    { id: 'add-skill', label: 'Add New Skill', keywords: ['add', 'new', 'skill', 'create'], tab: 'skill-framework' },
    { id: 'healthcare', label: 'Healthcare Domain', keywords: ['healthcare', 'medical', 'health', 'clinical'], tab: 'skill-framework' },
    { id: 'agriculture', label: 'Agriculture Domain', keywords: ['agriculture', 'farming', 'crop', 'agri'], tab: 'skill-framework' },
    { id: 'urban', label: 'Urban Informatics Domain', keywords: ['urban', 'city', 'smart city', 'informatics'], tab: 'skill-framework' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = searchableItems.filter(item => 
        item.label.toLowerCase().includes(query) ||
        item.keywords.some(kw => kw.includes(query))
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleSearchSelect = (item) => {
    setActiveTab(item.tab);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSearchSelect(searchResults[0]);
    }
    if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'job-role-management',
      label: 'Job Role Management',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'skill-framework',
      label: 'Skill Framework',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      id: 'role-skill-mapping',
      label: 'Role-Skill Mapping',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      id: 'gap-analysis-config',
      label: 'Gap Analysis Config',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
        id: 'recommendations',
        label: 'Recommendations',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-r transition-all duration-300 flex flex-col fixed h-full z-20`}>
        {/* Logo Section */}
        <div className={`h-20 flex items-center px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/30">
              SS
            </div>
            {!sidebarCollapsed && (
              <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-white to-gray-300' : 'from-gray-900 to-gray-700'}`}>
                SkillSphere
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${activeTab === item.id
                ? darkMode 
                  ? 'bg-blue-900/50 text-blue-400 shadow-sm'
                  : 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                : darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
              )}
              <span className={`transition-colors ${activeTab === item.id ? 'text-blue-600' : darkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="ml-3 text-sm font-medium tracking-wide">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-all ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Header */}
        <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search pages, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className={`w-full pl-11 pr-4 py-2.5 border-none rounded-2xl text-sm focus:ring-2 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:bg-gray-600' 
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-blue-100 focus:bg-white'
                }`}
              />
              <svg className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg overflow-hidden z-50 ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
                {searchResults.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchSelect(item)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-600 text-gray-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    } ${index !== searchResults.length - 1 ? (darkMode ? 'border-b border-gray-600' : 'border-b border-gray-100') : ''}`}
                  >
                    <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
            
            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg p-4 z-50 ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 ml-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <div className={`h-8 w-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className={`text-sm font-bold leading-none mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Admin User'}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PLATFORM LEAD</div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`}
                    alt="Profile"
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all text-sm font-semibold ml-2"
              >
                <span>Exit</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 p-8 overflow-y-auto ${darkMode ? 'bg-gray-900' : ''}`}>
          {React.Children.map(children, child =>
            React.isValidElement(child) ? React.cloneElement(child, { darkMode }) : child
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
