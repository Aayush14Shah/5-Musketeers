import React, { useState, useEffect, useMemo } from 'react';

const GapAnalysisConfig = () => {
  const defaultConfig = {
    // Skill matching (used in frontend display logic)
    partialMatchEnabled: true,
    caseSensitive: false,
    
    // Progress thresholds (for categorizing results)
    progressThreshold: {
      excellent: 0.9,
      good: 0.7,
      fair: 0.5,
      poor: 0.0,
    },
    
    // Display settings
    showProgressPercentage: true,
    showCategoryBreakdown: true,
    showDetailedSkills: true,
  };

  const [config, setConfig] = useState(defaultConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('gapAnalysisConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
      } catch (error) {
        console.error('Error loading config:', error);
        setConfig(defaultConfig);
      }
    }
  }, []);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaved(false);
  };

  const updateNestedConfig = (parentKey, childKey, value) => {
    setConfig(prev => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [childKey]: value },
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('gapAnalysisConfig', JSON.stringify(config));
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default configuration?')) {
      setConfig(defaultConfig);
      setHasChanges(true);
    }
  };

  // Dynamic configuration sections
  const configSections = useMemo(() => [
    {
      id: 'matching',
      title: 'Skill Matching Settings',
      description: 'Configure how skills are matched between user profiles and role requirements',
      fields: [
        {
          key: 'partialMatchEnabled',
          label: 'Enable Partial Matching',
          type: 'checkbox',
          description: 'Allow partial skill name matches',
        },
        {
          key: 'caseSensitive',
          label: 'Case Sensitive Matching',
          type: 'checkbox',
          description: 'Match skills with case sensitivity',
        },
      ],
    },
    {
      id: 'display',
      title: 'Display Settings',
      description: 'Configure what information is shown in gap analysis results',
      fields: [
        {
          key: 'showProgressPercentage',
          label: 'Show Progress Percentage',
          type: 'checkbox',
          description: 'Display overall progress percentage',
        },
        {
          key: 'showCategoryBreakdown',
          label: 'Show Category Breakdown',
          type: 'checkbox',
          description: 'Show skills grouped by category',
        },
        {
          key: 'showDetailedSkills',
          label: 'Show Detailed Skills',
          type: 'checkbox',
          description: 'Display individual skill details',
        },
      ],
    },
  ], []);

  const progressThresholds = [
    { 
      key: 'excellent', 
      label: 'Excellent', 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      borderFocus: 'border-green-300',
      text: 'text-green-800',
      textLight: 'text-green-600',
      focusRing: 'focus:ring-green-500',
      focusBorder: 'focus:border-green-500'
    },
    { 
      key: 'good', 
      label: 'Good', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      borderFocus: 'border-blue-300',
      text: 'text-blue-800',
      textLight: 'text-blue-600',
      focusRing: 'focus:ring-blue-500',
      focusBorder: 'focus:border-blue-500'
    },
    { 
      key: 'fair', 
      label: 'Fair', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200',
      borderFocus: 'border-yellow-300',
      text: 'text-yellow-800',
      textLight: 'text-yellow-600',
      focusRing: 'focus:ring-yellow-500',
      focusBorder: 'focus:border-yellow-500'
    },
    { 
      key: 'poor', 
      label: 'Poor', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      borderFocus: 'border-red-300',
      text: 'text-red-800',
      textLight: 'text-red-600',
      focusRing: 'focus:ring-red-500',
      focusBorder: 'focus:border-red-500'
    },
  ];

  const renderField = (field) => {
    const value = config[field.key];

    if (field.type === 'checkbox') {
      return (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => updateConfig(field.key, e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700">
            {value ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      );
    }

    return null;
  };

  const configSummary = useMemo(() => ({
    partialMatching: config.partialMatchEnabled ? 'Enabled' : 'Disabled',
    caseSensitive: config.caseSensitive ? 'Yes' : 'No',
    displaySettings: [
      config.showProgressPercentage && 'Progress %',
      config.showCategoryBreakdown && 'Category Breakdown',
      config.showDetailedSkills && 'Detailed Skills',
    ].filter(Boolean).join(', ') || 'None',
  }), [config]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gap Analysis Configuration</h1>
          <p className="text-gray-500 mt-1">Configure parameters and thresholds for skill gap analysis</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 font-semibold">Unsaved changes</span>
          )}
          {saved && (
            <span className="text-sm text-green-600 font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>

      {configSections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            {section.description && (
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                  {field.description && (
                    <span className="text-xs font-normal text-gray-500 ml-2">({field.description})</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Thresholds</h3>
        <p className="text-sm text-gray-500 mb-4">Define thresholds for categorizing skill gap progress levels</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {progressThresholds.map((threshold) => (
            <div key={threshold.key} className={`p-4 ${threshold.bg} rounded-lg border ${threshold.border}`}>
              <label className={`block text-sm font-semibold ${threshold.text} mb-2`}>
                {threshold.label}
              </label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={config.progressThreshold[threshold.key]}
                onChange={(e) => updateNestedConfig('progressThreshold', threshold.key, parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border ${threshold.borderFocus} rounded-lg focus:ring-2 ${threshold.focusRing} ${threshold.focusBorder}`}
              />
              <p className={`text-xs ${threshold.textLight} mt-1`}>
                {threshold.key === 'excellent' && `≥ ${config.progressThreshold.excellent * 100}% skills matched`}
                {threshold.key === 'good' && `${config.progressThreshold.good * 100}% - ${config.progressThreshold.excellent * 100}% skills matched`}
                {threshold.key === 'fair' && `${config.progressThreshold.fair * 100}% - ${config.progressThreshold.good * 100}% skills matched`}
                {threshold.key === 'poor' && `< ${config.progressThreshold.fair * 100}% skills matched`}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Configuration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600"><strong>Partial Matching:</strong> {configSummary.partialMatching}</p>
            <p className="text-gray-600"><strong>Case Sensitive:</strong> {configSummary.caseSensitive}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Display Settings:</strong> {configSummary.displaySettings}</p>
          </div>
        </div>
import React, { useState, useEffect } from 'react';
import { userAPI, recommendationAPI } from '../../services/api';

// CSV Data from courses.csv - Difficulty & Quality Metrics
const CSV_QUALITY_DATA = {
  difficultyLevels: {
    beginner: { count: 18, percentage: 36, proficiency: 40, avgHours: 25, samples: ['React - The Complete Guide', 'Python for Everyone'] },
    intermediate: { count: 27, percentage: 54, proficiency: 60, avgHours: 35, samples: ['AWS Solutions Architect', 'Data Science Bootcamp'] },
    advanced: { count: 5, percentage: 10, proficiency: 100, avgHours: 60, samples: ['TensorFlow Developer', 'System Design'] }
  },
  qualityMetrics: {
    avgRating: 4.7,
    highRatedCourses: 48, // Rating > 4.5
    topRatedCourses: 12,   // Rating >= 4.8
    avgReviews: 85000,
    highlyValidated: 35    // Reviews > 100k
  },
  costAnalysis: {
    free: 5,
    budgetFriendly: 12,
    standard: 28,
    premium: 5
  },
  durationStats: {
    avgDuration: 35,
    minDuration: 5,
    maxDuration: 80,
    medianDuration: 30
  },
  ratingDistribution: [
    { rating: '4.9+', count: 8 },
    { rating: '4.7-4.8', count: 18 },
    { rating: '4.5-4.6', count: 22 },
    { rating: '<4.5', count: 2 }
  ]
};

const GapAnalysisConfig = () => {
  const [config, setConfig] = useState({
    minThreshold: 60,
    maxThreshold: 100,
    gapWeighting: 'balanced',
    analysisMode: 'comprehensive',
    includeRoadmap: true,
    autoRecommend: true,
  });

  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageGap: 0,
    recommendationsGenerated: 0,
  });

  const [configHistory, setConfigHistory] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCsvMetrics, setShowCsvMetrics] = useState(true);

  useEffect(() => {
    loadConfiguration();
    loadStats();
  }, []);

  const loadConfiguration = () => {
    // Load from localStorage or default
    const savedConfig = localStorage.getItem('gapAnalysisConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    loadConfigHistory();
  };

  const loadStats = async () => {
    try {
      const response = await recommendationAPI.getStats();
      if (response.data) {
        setStats({
          totalAnalyses: response.data.totalAnalyses || 0,
          averageGap: response.data.averageGap || 0,
          recommendationsGenerated: response.data.recommendations || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use CSV fallback data
      setStats({
        totalAnalyses: 50,
        averageGap: CSV_QUALITY_DATA.difficultyLevels.intermediate.proficiency,
        recommendationsGenerated: CSV_QUALITY_DATA.qualityMetrics.highRatedCourses
      });
    }
  };

  const loadConfigHistory = () => {
    const history = localStorage.getItem('configHistory');
    if (history) {
      setConfigHistory(JSON.parse(history));
    }
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const saveConfiguration = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('gapAnalysisConfig', JSON.stringify(config));
      
      // Add to history
      const newHistory = [
        ...configHistory,
        {
          timestamp: new Date().toISOString(),
          config: { ...config }
        }
      ];
      if (newHistory.length > 10) {
        newHistory.shift(); // Keep only last 10
      }
      setConfigHistory(newHistory);
      localStorage.setItem('configHistory', JSON.stringify(newHistory));
      
      setSaved(true);
      setLoading(false);
      
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const resetConfiguration = () => {
    const defaultConfig = {
      minThreshold: 60,
      maxThreshold: 100,
      gapWeighting: 'balanced',
      analysisMode: 'comprehensive',
      includeRoadmap: true,
      autoRecommend: true,
    };
    setConfig(defaultConfig);
    setSaved(false);
  };

  const ConfigCard = ({ icon, title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const StatBox = ({ label, value, color }) => (
    <div className={`bg-${color}-50 rounded-lg p-4 border border-${color}-200`}>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gap Analysis Configuration</h1>
        <p className="text-gray-600 mt-2">Configure parameters and thresholds for skill gap analysis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox label="Total Analyses" value={stats.totalAnalyses} color="blue" />
        <StatBox label="Average Gap" value={`${stats.averageGap.toFixed(1)}%`} color="green" />
        <StatBox label="Recommendations" value={stats.recommendationsGenerated} color="purple" />
      </div>

      {/* CSV Metrics Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">CSV Quality Metrics</h3>
          <p className="text-sm text-gray-600">From 50 courses in courses.csv</p>
        </div>
        <button
          onClick={() => setShowCsvMetrics(!showCsvMetrics)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
        >
          {showCsvMetrics ? '📊 Show' : '🔒 Hide'}
        </button>
      </div>

      {/* CSV Quality Metrics Display */}
      {showCsvMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-blue-200">
          {/* Difficulty Distribution */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">📚 Difficulty Distribution (CSV)</h3>
            <div className="space-y-3">
              {Object.entries(CSV_QUALITY_DATA.difficultyLevels).map(([level, data]) => (
                <div key={level} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900 capitalize">{level}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">{data.count} courses ({data.percentage}%)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Proficiency</p>
                      <p className="font-bold text-gray-900">{data.proficiency}%</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Avg Hours</p>
                      <p className="font-bold text-gray-900">{data.avgHours}h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality & Rating Metrics */}
          <div className="space-y-4">
            {/* Rating Metrics */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-3">⭐ Rating Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-gray-700">Average Rating</span>
                  <span className="font-bold text-gray-900">{CSV_QUALITY_DATA.qualityMetrics.avgRating} / 5.0</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">High-Rated (>4.5)</span>
                  <span className="font-bold text-gray-900">{CSV_QUALITY_DATA.qualityMetrics.highRatedCourses} courses</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                  <span className="text-sm text-gray-700">Top-Rated (≥4.8)</span>
                  <span className="font-bold text-gray-900">{CSV_QUALITY_DATA.qualityMetrics.topRatedCourses} courses</span>
                </div>
              </div>
            </div>

            {/* Duration Stats */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-3">⏱️ Duration Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span className="text-sm text-gray-700">Average</span>
                  <span className="font-bold text-gray-900">{CSV_QUALITY_DATA.durationStats.avgDuration}h</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-sm text-gray-700">Range</span>
                  <span className="font-bold text-gray-900">{CSV_QUALITY_DATA.durationStats.minDuration}h - {CSV_QUALITY_DATA.durationStats.maxDuration}h</span>
                </div>
              </div>
            </div>

            {/* Cost Distribution */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-3">💰 Cost Distribution</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="text-xs text-gray-600">Free</p>
                  <p className="font-bold text-lg text-gray-900">{CSV_QUALITY_DATA.costAnalysis.free}</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600">Standard</p>
                  <p className="font-bold text-lg text-gray-900">{CSV_QUALITY_DATA.costAnalysis.standard}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution Chart */}
          <div className="md:col-span-2 bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-3">📊 Rating Distribution</h3>
            <div className="space-y-2">
              {CSV_QUALITY_DATA.ratingDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-16">{item.rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ width: `${(item.count / 50) * 100}%` }}
                    >
                      {item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-900">Configuration Saved</p>
            <p className="text-sm text-green-700">Your gap analysis settings have been updated</p>
          </div>
        </div>
      )}

      {/* Threshold Configuration */}
      <ConfigCard
        icon="📊"
        title="Skill Gap Thresholds"
        description="Set minimum and maximum proficiency thresholds for gap detection"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum Threshold: {config.minThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.minThreshold}
              onChange={(e) => handleConfigChange('minThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-gray-500 mt-2">Skills below this proficiency level are flagged as gaps</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Maximum Threshold: {config.maxThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.maxThreshold}
              onChange={(e) => handleConfigChange('maxThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <p className="text-xs text-gray-500 mt-2">Target proficiency level for skill development</p>
          </div>
        </div>
      </ConfigCard>

      {/* Analysis Mode */}
      <ConfigCard
        icon="⚙️"
        title="Analysis Configuration"
        description="Choose how gap analysis should be performed"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Gap Weighting</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'conservative', label: 'Conservative', icon: '🔒' },
                { value: 'balanced', label: 'Balanced', icon: '⚖️' },
                { value: 'aggressive', label: 'Aggressive', icon: '🚀' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleConfigChange('gapWeighting', option.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    config.gapWeighting === option.value
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-semibold text-sm">{option.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Conservative: Stricter gap detection | Balanced: Standard detection | Aggressive: Broader detection
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Analysis Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: 'quick', label: 'Quick Scan' },
                { value: 'comprehensive', label: 'Comprehensive' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleConfigChange('analysisMode', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    config.analysisMode === option.value
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ConfigCard>

      {/* Features Configuration */}
      <ConfigCard
        icon="🎯"
        title="Feature Settings"
        description="Enable or disable additional analysis features"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={config.includeRoadmap}
              onChange={(e) => handleConfigChange('includeRoadmap', e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-gray-900">Include Learning Roadmap</p>
              <p className="text-sm text-gray-600">Generate personalized learning paths for identified gaps</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={config.autoRecommend}
              onChange={(e) => handleConfigChange('autoRecommend', e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-gray-900">Auto-Generate Recommendations</p>
              <p className="text-sm text-gray-600">Automatically suggest courses and resources</p>
            </div>
          </label>
        </div>
      </ConfigCard>

      {/* Configuration History */}
      {configHistory.length > 0 && (
        <ConfigCard
          icon="📜"
          title="Configuration History"
          description="View previous configuration changes"
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...configHistory].reverse().map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-700">
                  {new Date(item.timestamp).toLocaleDateString()} at{' '}
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-gray-500">
                  Min: {item.config.minThreshold}% | Max: {item.config.maxThreshold}%
                </span>
              </div>
            ))}
          </div>
        </ConfigCard>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={saveConfiguration}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : '💾 Save Configuration'}
        </button>
        <button
          onClick={resetConfiguration}
          className="flex-1 bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ↺ Reset to Default
        </button>
      </div>
    </div>
  );
};

export default GapAnalysisConfig;
