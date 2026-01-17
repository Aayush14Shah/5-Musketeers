import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center space-x-2 border-b border-gray-700">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold">Skill Intel PLATFORM V2.0</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-teal-600 rounded-lg text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Roles</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Skill Maps</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </a>
        </nav>

        {/* Support Section */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Documentation</span>
          </a>
        </div>

        {/* New Analysis Button */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>New Analysis</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Intelligence Dashboard</h1>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search insights, skills or users..."
                  className="w-80 bg-gray-700 text-gray-200 placeholder-gray-400 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Notifications */}
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-white relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="text-gray-400 hover:text-white relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
              {/* Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Admin Profile</p>
                  <p className="text-xs text-gray-400">Platform Lead</p>
                </div>
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Metric Cards Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Total Users Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-white mb-2">12,450</p>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-400 text-sm font-medium">+12.4%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            {/* Active Roles Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Stable</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Active Roles</h3>
              <p className="text-3xl font-bold text-white mb-2">84</p>
              <div className="flex items-center space-x-1 mt-4">
                <div className="h-8 w-2 bg-gray-600 rounded"></div>
                <div className="h-10 w-2 bg-gray-600 rounded"></div>
                <div className="h-12 w-2 bg-blue-500 rounded"></div>
                <div className="h-8 w-2 bg-gray-600 rounded"></div>
                <div className="h-10 w-2 bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Skills Mapped Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
                <span className="text-green-400 text-xs font-medium">+5.2%</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Skills Mapped</h3>
              <p className="text-3xl font-bold text-white mb-2">1,280+</p>
              <div className="flex items-center space-x-2 mt-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                <div className="w-8 h-8 bg-purple-400 rounded-full -ml-2"></div>
                <div className="w-8 h-8 bg-purple-300 rounded-full -ml-2"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full -ml-2 flex items-center justify-center border-2 border-gray-600">
                  <span className="text-xs text-gray-400">+24</span>
                </div>
              </div>
            </div>

            {/* Skill Readiness Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-yellow-400 text-xs font-medium">Crit.</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Skill Readiness</h3>
              <p className="text-3xl font-bold text-white mb-2">78%</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Middle Section - Charts and Insights */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Skill Gap Distribution */}
            <div className="col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Skill Gap Distribution</h2>
                  <p className="text-sm text-gray-400">Proficiency Coverage by Department</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg font-medium">Radial View</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600">Linear</button>
                </div>
              </div>
              <div className="flex items-center justify-center py-8">
                {/* Radial Chart Visualization */}
                <div className="relative w-64 h-64">
                  {/* Outer ring segments */}
                  <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 200 200">
                    {/* DEVOPS segment - large teal */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="40"
                      strokeDasharray={`${2 * Math.PI * 80 * 0.5} ${2 * Math.PI * 80}`}
                      strokeDashoffset={0}
                    />
                    {/* CLOUD segment - medium teal */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="40"
                      strokeDasharray={`${2 * Math.PI * 80 * 0.32} ${2 * Math.PI * 80}`}
                      strokeDashoffset={-2 * Math.PI * 80 * 0.5}
                    />
                    {/* DATA segment - gold */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="40"
                      strokeDasharray={`${2 * Math.PI * 80 * 0.13} ${2 * Math.PI * 80}`}
                      strokeDashoffset={-2 * Math.PI * 80 * 0.82}
                    />
                    {/* AI/ML segment - dark grey */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="40"
                      strokeDasharray={`${2 * Math.PI * 80 * 0.05} ${2 * Math.PI * 80}`}
                      strokeDashoffset={-2 * Math.PI * 80 * 0.95}
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">82%</span>
                    <span className="text-sm text-gray-400 mt-1">GLOBAL MATCH</span>
                  </div>
                </div>
              </div>
              {/* Labels */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-4 h-4 bg-teal-500 rounded mx-auto mb-1"></div>
                  <p className="text-xs text-gray-400">DEVOPS</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-teal-500 rounded mx-auto mb-1"></div>
                  <p className="text-xs text-gray-400">CLOUD</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
                  <p className="text-xs text-gray-400">DATA</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-gray-600 rounded mx-auto mb-1"></div>
                  <p className="text-xs text-gray-400">AI/ML</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h2 className="text-xl font-bold text-white">AI Insights</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4">REAL-TIME ANALYSIS</p>
              <div className="space-y-4">
                {/* Critical Shortage */}
                <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-200">
                      Infrastructure team lacks 3 advanced Python certifications for upcoming Q3 project.
                    </p>
                  </div>
                </div>

                {/* Course Recommendation */}
                <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-200">
                      "Advanced AWS Architecture" would improve readiness for 12% of your mid-level devs.
                    </p>
                  </div>
                </div>

                {/* Efficiency Boost */}
                <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-200">
                      Skill mapping coverage has reached 90% in the Frontend department.
                    </p>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-gray-500">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-200">
                      "Predictive model suggests 15 new hires needed in security by 2025."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - In-Demand IT Skills */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">In-Demand IT Skills</h2>
                <p className="text-sm text-gray-400">Market demand vs internal availability</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                +15% WEEKLY TREND
              </span>
            </div>
            <div className="mt-8">
              {/* Bar Chart Visualization */}
              <div className="flex items-end space-x-4 h-48">
                {['Python', 'AWS', 'React', 'Kubernetes', 'Docker', 'TypeScript'].map((skill, index) => {
                  const demandHeight = [85, 75, 90, 65, 70, 80][index];
                  const availabilityHeight = [60, 55, 70, 40, 50, 65][index];
                  return (
                    <div key={skill} className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-full flex flex-col items-center space-y-1" style={{ height: '100%' }}>
                        <div
                          className="w-full bg-teal-500 rounded-t"
                          style={{ height: `${demandHeight}%` }}
                        ></div>
                        <div
                          className="w-full bg-yellow-500 rounded-t"
                          style={{ height: `${availabilityHeight}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 text-center">{skill}</span>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-teal-500 rounded"></div>
                  <span className="text-xs text-gray-400">Market Demand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-400">Internal Availability</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
