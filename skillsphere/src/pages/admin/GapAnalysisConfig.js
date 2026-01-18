import React, { useState, useEffect } from 'react';

const GapAnalysisConfig = () => {
  const [config, setConfig] = useState({
    // Skill matching thresholds
    skillMatchThreshold: 0.7, // Minimum similarity for skill matching (0-1)
    partialMatchEnabled: true, // Allow partial skill name matches
    caseSensitive: false, // Case sensitivity for matching
    
    // Importance weights
    easyWeight: 1.0,
    mediumWeight: 2.0,
    hardWeight: 3.0,
    
    // Gap analysis thresholds
    minSkillsForAnalysis: 3, // Minimum skills required for meaningful analysis
    progressThreshold: {
      excellent: 0.9, // 90%+ skills matched
      good: 0.7, // 70-90% skills matched
      fair: 0.5, // 50-70% skills matched
      poor: 0.0, // <50% skills matched
    },
    
    // Recommendations settings
    maxRecommendations: 10, // Maximum recommendations to show
    prioritizeMissingHard: true, // Prioritize hard skills in recommendations
    includeMatchedSkills: false, // Include matched skills in recommendations
    
    // Display settings
    showProgressPercentage: true,
    showCategoryBreakdown: true,
    showDetailedSkills: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    try {
      const savedConfig = localStorage.getItem('gapAnalysisConfig');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...config, ...parsed });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleNestedConfigChange = (parentKey, childKey, value) => {
    setConfig(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
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
      const defaultConfig = {
        skillMatchThreshold: 0.7,
        partialMatchEnabled: true,
        caseSensitive: false,
        easyWeight: 1.0,
        mediumWeight: 2.0,
        hardWeight: 3.0,
        minSkillsForAnalysis: 3,
        progressThreshold: {
          excellent: 0.9,
          good: 0.7,
          fair: 0.5,
          poor: 0.0,
        },
        maxRecommendations: 10,
        prioritizeMissingHard: true,
        includeMatchedSkills: false,
        showProgressPercentage: true,
        showCategoryBreakdown: true,
        showDetailedSkills: true,
      };
      setConfig(defaultConfig);
      setHasChanges(true);
    }
  };

  const ConfigSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  const ConfigInput = ({ label, value, onChange, type = 'text', min, max, step, description }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {description && (
          <span className="text-xs font-normal text-gray-500 ml-2">({description})</span>
        )}
      </label>
      {type === 'range' ? (
        <div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{min}</span>
            <span className="font-semibold text-indigo-600">{value}</span>
            <span>{max}</span>
          </div>
        </div>
      ) : type === 'number' ? (
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      ) : type === 'checkbox' ? (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700">
            {value ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Skill Matching Configuration */}
      <ConfigSection
        title="Skill Matching Settings"
        description="Configure how skills are matched between user profiles and role requirements"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfigInput
            label="Skill Match Threshold"
            value={config.skillMatchThreshold}
            onChange={(value) => handleConfigChange('skillMatchThreshold', value)}
            type="range"
            min={0}
            max={1}
            step={0.1}
            description="Minimum similarity score (0.0 - 1.0)"
          />
          <div className="text-sm text-gray-600 mt-2">
            <p>Current threshold: <span className="font-semibold">{config.skillMatchThreshold}</span></p>
            <p className="mt-1">Lower values allow more flexible matching, higher values require exact matches.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <ConfigInput
            label="Enable Partial Matching"
            value={config.partialMatchEnabled}
            onChange={(value) => handleConfigChange('partialMatchEnabled', value)}
            type="checkbox"
            description="Allow partial skill name matches"
          />
          <ConfigInput
            label="Case Sensitive Matching"
            value={config.caseSensitive}
            onChange={(value) => handleConfigChange('caseSensitive', value)}
            type="checkbox"
            description="Match skills with case sensitivity"
          />
        </div>
      </ConfigSection>

      {/* Importance Weights */}
      <ConfigSection
        title="Skill Importance Weights"
        description="Set weights for different skill difficulty levels in gap analysis calculations"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConfigInput
            label="Easy Skills Weight"
            value={config.easyWeight}
            onChange={(value) => handleConfigChange('easyWeight', value)}
            type="number"
            min={0.5}
            max={5}
            step={0.5}
            description="Weight for easy skills"
          />
          <ConfigInput
            label="Medium Skills Weight"
            value={config.mediumWeight}
            onChange={(value) => handleConfigChange('mediumWeight', value)}
            type="number"
            min={0.5}
            max={5}
            step={0.5}
            description="Weight for medium skills"
          />
          <ConfigInput
            label="Hard Skills Weight"
            value={config.hardWeight}
            onChange={(value) => handleConfigChange('hardWeight', value)}
            type="number"
            min={0.5}
            max={5}
            step={0.5}
            description="Weight for hard skills"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Higher weights mean these skills contribute more to the overall gap analysis score.
            Hard skills typically have higher weights as they are more critical for role success.
          </p>
        </div>
      </ConfigSection>

      {/* Progress Thresholds */}
      <ConfigSection
        title="Progress Thresholds"
        description="Define thresholds for categorizing skill gap progress levels"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <label className="block text-sm font-semibold text-green-800 mb-2">Excellent</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={config.progressThreshold.excellent}
              onChange={(e) => handleNestedConfigChange('progressThreshold', 'excellent', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-green-600 mt-1">≥ {config.progressThreshold.excellent * 100}% skills matched</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold text-blue-800 mb-2">Good</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={config.progressThreshold.good}
              onChange={(e) => handleNestedConfigChange('progressThreshold', 'good', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-blue-600 mt-1">
              {config.progressThreshold.good * 100}% - {config.progressThreshold.excellent * 100}% skills matched
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <label className="block text-sm font-semibold text-yellow-800 mb-2">Fair</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={config.progressThreshold.fair}
              onChange={(e) => handleNestedConfigChange('progressThreshold', 'fair', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <p className="text-xs text-yellow-600 mt-1">
              {config.progressThreshold.fair * 100}% - {config.progressThreshold.good * 100}% skills matched
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="block text-sm font-semibold text-red-800 mb-2">Poor</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={config.progressThreshold.poor}
              onChange={(e) => handleNestedConfigChange('progressThreshold', 'poor', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <p className="text-xs text-red-600 mt-1">&lt; {config.progressThreshold.fair * 100}% skills matched</p>
          </div>
        </div>
      </ConfigSection>

      {/* Recommendations Settings */}
      <ConfigSection
        title="Recommendations Settings"
        description="Configure how recommendations are generated and displayed"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfigInput
            label="Maximum Recommendations"
            value={config.maxRecommendations}
            onChange={(value) => handleConfigChange('maxRecommendations', value)}
            type="number"
            min={1}
            max={50}
            step={1}
            description="Maximum number of recommendations to show"
          />
          <ConfigInput
            label="Prioritize Missing Hard Skills"
            value={config.prioritizeMissingHard}
            onChange={(value) => handleConfigChange('prioritizeMissingHard', value)}
            type="checkbox"
            description="Show hard skills first in recommendations"
          />
        </div>
        <div className="mt-4">
          <ConfigInput
            label="Include Matched Skills"
            value={config.includeMatchedSkills}
            onChange={(value) => handleConfigChange('includeMatchedSkills', value)}
            type="checkbox"
            description="Show already matched skills in recommendations"
          />
        </div>
        <div className="mt-4">
          <ConfigInput
            label="Minimum Skills for Analysis"
            value={config.minSkillsForAnalysis}
            onChange={(value) => handleConfigChange('minSkillsForAnalysis', value)}
            type="number"
            min={1}
            max={20}
            step={1}
            description="Minimum skills required for meaningful gap analysis"
          />
        </div>
      </ConfigSection>

      {/* Display Settings */}
      <ConfigSection
        title="Display Settings"
        description="Configure what information is shown in gap analysis results"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConfigInput
            label="Show Progress Percentage"
            value={config.showProgressPercentage}
            onChange={(value) => handleConfigChange('showProgressPercentage', value)}
            type="checkbox"
            description="Display overall progress percentage"
          />
          <ConfigInput
            label="Show Category Breakdown"
            value={config.showCategoryBreakdown}
            onChange={(value) => handleConfigChange('showCategoryBreakdown', value)}
            type="checkbox"
            description="Show skills grouped by category"
          />
          <ConfigInput
            label="Show Detailed Skills"
            value={config.showDetailedSkills}
            onChange={(value) => handleConfigChange('showDetailedSkills', value)}
            type="checkbox"
            description="Display individual skill details"
          />
        </div>
      </ConfigSection>

      {/* Configuration Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Configuration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600"><strong>Match Threshold:</strong> {config.skillMatchThreshold}</p>
            <p className="text-gray-600"><strong>Partial Matching:</strong> {config.partialMatchEnabled ? 'Enabled' : 'Disabled'}</p>
            <p className="text-gray-600"><strong>Case Sensitive:</strong> {config.caseSensitive ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Weights:</strong> Easy={config.easyWeight}, Medium={config.mediumWeight}, Hard={config.hardWeight}</p>
            <p className="text-gray-600"><strong>Max Recommendations:</strong> {config.maxRecommendations}</p>
            <p className="text-gray-600"><strong>Min Skills for Analysis:</strong> {config.minSkillsForAnalysis}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysisConfig;
