import React from 'react';

const AdminLayout = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout,
  sidebarCollapsed,
  setSidebarCollapsed 
}) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'job-role-management', icon: '💼', label: 'Job Role Management' },
    { id: 'skill-framework', icon: '🎯', label: 'Skill Framework' },
    { id: 'role-skill-mapping', icon: '🔗', label: 'Role-Skill Mapping' },
    { id: 'gap-analysis-config', icon: '📈', label: 'Gap Analysis Config' },
    { id: 'recommendations', icon: '💡', label: 'Recommendations' },
  ];

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
            <p className="text-xs text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
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
                <div className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">Platform Lead</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
