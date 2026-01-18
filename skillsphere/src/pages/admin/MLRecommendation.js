import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const MLRecommendation = ({ skillsFromGapAnalysis = [], autoFetch = false }) => {
  const [missingSkills, setMissingSkills] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('recommend');
  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillsFromAnalysis, setSkillsFromAnalysis] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (skillsFromGapAnalysis && skillsFromGapAnalysis.length > 0) {
      const skillNames = skillsFromGapAnalysis.map(s => typeof s === 'string' ? s : s.name);
      setSkillsFromAnalysis(skillNames);
      setMissingSkills(skillNames.join(', '));
      
      if (autoFetch) {
        setTimeout(() => {
          fetchRecommendationsForSkills(skillNames);
        }, 500);
      }
    }
  }, [skillsFromGapAnalysis, autoFetch]);

  const fetchRecommendationsForSkills = async (skillsArray) => {
    if (!skillsArray || skillsArray.length === 0) return;
    
    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await API.post('/recommendations/recommend', {
        missingSkills: skillsArray,
        domain: selectedDomain !== 'all' ? selectedDomain : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        limit: 10
      });

      setRecommendations(response.data.recommendations);
      setAlgorithmInfo({
        algorithm: response.data.algorithm,
        factors: response.data.factors,
        totalCourses: response.data.totalCourses,
        filteredCount: response.data.filteredCount
      });
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await API.get('/recommendations/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadAllCourses = async () => {
    setCoursesLoading(true);
    try {
      const response = await API.get('/recommendations/courses', {
        params: { 
          domain: selectedDomain !== 'all' ? selectedDomain : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          search: searchQuery || undefined,
          limit: 50
        }
      });
      setAllCourses(response.data.courses);
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'browse') {
      loadAllCourses();
    }
  }, [activeTab, selectedDomain, selectedDifficulty, searchQuery]);

  const handleGetRecommendations = async () => {
    if (!missingSkills.trim()) {
      setError('Please enter at least one skill');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const skillsArray = missingSkills.split(',').map(s => s.trim()).filter(s => s);
      
      const response = await API.post('/recommendations/recommend', {
        missingSkills: skillsArray,
        domain: selectedDomain !== 'all' ? selectedDomain : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        limit: 10
      });

      setRecommendations(response.data.recommendations);
      setAlgorithmInfo({
        algorithm: response.data.algorithm,
        factors: response.data.factors,
        totalCourses: response.data.totalCourses,
        filteredCount: response.data.filteredCount
      });
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'udemy': return 'bg-purple-100 text-purple-700';
      case 'coursera': return 'bg-blue-100 text-blue-700';
      case 'youtube': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Smart Course Recommendations</h1>
          <p className="text-indigo-100">
            Get personalized learning path recommendations using our hybrid algorithm combining 
            TF-IDF, Cosine Similarity, and Content-Based Filtering.
          </p>
        </div>

        {skillsFromAnalysis.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-green-800">Skills from Gap Analysis</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsFromAnalysis.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm text-green-600 mt-2">
              These are your missing skills. Click "Get Recommendations" to find courses!
            </p>
          </div>
        )}

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('recommend')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'recommend'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Get Recommendations
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'browse'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Browse All Courses
        </button>
        <button
          onClick={() => setActiveTab('algorithm')}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === 'algorithm'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          How It Works
        </button>
      </div>

{activeTab === 'recommend' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  {skillsFromAnalysis.length > 0 ? 'Your Missing Skills' : 'Enter Skills to Learn'}
                </h3>
                
                <div className="space-y-4">
                  {skillsFromAnalysis.length > 0 ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills from Gap Analysis ({skillsFromAnalysis.length} skills)
                      </label>
                      <div className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                        {skillsFromAnalysis.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white text-green-700 rounded-full text-sm font-medium border border-green-300 shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        These skills were identified from your Skill Gap Analysis
                      </p>
                    </div>
                  ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Missing Skills (comma-separated)
                    </label>
                    <textarea
                      value={missingSkills}
                      onChange={(e) => setMissingSkills(e.target.value)}
                      placeholder="e.g., React, Python, Machine Learning, Docker"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  )}

                  {skillsFromAnalysis.length === 0 && (
                  <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Domain
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="all">All Domains</option>
                      {stats?.domains?.map(d => (
                        <option key={d.domain} value={d.domain}>
                          {d.domain.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ({d.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="all">Any Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  </>
                  )}
                  </div>

                  <button
                  onClick={handleGetRecommendations}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Get ML Recommendations'}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                </div>

              {stats && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Dataset Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Courses</span>
                      <span className="font-semibold">{stats.totalCourses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Domains</span>
                      <span className="font-semibold">{stats.domains?.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platforms</span>
                      <span className="font-semibold">{stats.platforms?.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          <div className="lg:col-span-2">
            {algorithmInfo && recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-blue-800">Algorithm: {algorithmInfo.algorithm.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <p className="text-sm text-blue-700">
                  Analyzed {algorithmInfo.filteredCount} courses using: {algorithmInfo.factors?.join(', ')}
                </p>
              </div>
            )}

            {recommendations.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">
                  Top {recommendations.length} Recommendations
                </h3>
                {recommendations.map((course, index) => (
                  <div
                    key={course.id || index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(course.platform)}`}>
                            {course.platform}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {course.matchedSkills?.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {course.rating}
                          </span>
                          <span>{course.duration_hours}h</span>
                          <span>{course.instructor}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600 mb-1">
                          {(course.relevanceScore * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                        
                        {course.scoreBreakdown && (
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <div>Skill: {course.scoreBreakdown.skillMatch}%</div>
                            <div>Content: {course.scoreBreakdown.contentSimilarity}%</div>
                          </div>
                        )}
                        
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          View Course
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Skills to Get Started</h3>
                <p className="text-gray-500">
                  Enter the skills you want to learn and our ML algorithm will recommend the best courses for you.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Domains</option>
                {stats?.domains?.map(d => (
                  <option key={d.domain} value={d.domain}>
                    {d.domain.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {coursesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-500">Loading courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCourses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(course.platform)}`}>
                      {course.platform}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skills?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skills?.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        +{course.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {course.rating}
                      </span>
                      <span>{course.duration_hours}h</span>
                    </div>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'algorithm' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hybrid Content-Based Filtering</h3>
            <p className="text-gray-600 mb-4">
              Our recommendation system uses a hybrid approach combining multiple ML techniques:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <div>
                  <strong className="text-gray-800">TF-IDF Vectorization</strong>
                  <p className="text-sm text-gray-600">Converts skills into weighted numerical vectors based on term frequency and inverse document frequency.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <div>
                  <strong className="text-gray-800">Cosine Similarity</strong>
                  <p className="text-sm text-gray-600">Measures the similarity between user's skill gaps and course skill vectors.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <div>
                  <strong className="text-gray-800">Skill Match Scoring</strong>
                  <p className="text-sm text-gray-600">Direct comparison with partial matching for skill variations.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <div>
                  <strong className="text-gray-800">Quality Metrics</strong>
                  <p className="text-sm text-gray-600">Incorporates course ratings and popularity as quality signals.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Calculation Formula</h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm mb-4">
              <p className="text-gray-700">
                Hybrid Score = <br />
                &nbsp;&nbsp;0.35 × Skill Match +<br />
                &nbsp;&nbsp;0.25 × Content Similarity +<br />
                &nbsp;&nbsp;0.15 × Rating Score +<br />
                &nbsp;&nbsp;0.10 × Popularity Score +<br />
                &nbsp;&nbsp;0.15 × Difficulty Alignment
              </p>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Weight Distribution</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Skill Match</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Content Similarity</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rating</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Difficulty Match</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Popularity</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dataset Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-600">{stats?.totalCourses || 50}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{stats?.domains?.length || 8}</div>
                <div className="text-sm text-gray-600">Domains</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{stats?.platforms?.length || 3}</div>
                <div className="text-sm text-gray-600">Platforms</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Difficulty Levels</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLRecommendation;
