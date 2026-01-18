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
      </div>
    </div>
  );
};

export default GapAnalysisConfig;
