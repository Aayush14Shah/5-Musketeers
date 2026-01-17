import React, { useState } from 'react';
import { recommendationAPI } from '../../services/api';

const Recommendations = () => {
  const [targetRole, setTargetRole] = useState('');
  const [missingSkills, setMissingSkills] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateValues = () => {
    // Pre-fill for demo/testing if empty
    if (!targetRole) setTargetRole('MERN Stack Developer');
    if (!missingSkills) setMissingSkills('React, MongoDB, Node.js, Express, Redux');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!missingSkills) {
      setError('Please enter missing skills');
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const skillsArray = missingSkills.split(',').map(s => s.trim()).filter(s => s);
      const response = await recommendationAPI.generateRoadmap({
        targetRole,
        missingSkills: skillsArray
      });
      setRoadmap(response.data);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Improvement Logic</h2>
        <p className="text-gray-600 mb-6">
          Generate a personalized 4-week learning roadmap based on missing skills.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. MERN Stack Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Missing Skills <span className="text-gray-400 text-xs">(Comma separated)</span>
            </label>
            <textarea
              value={missingSkills}
              onChange={(e) => setMissingSkills(e.target.value)}
              placeholder="e.g. React, MongoDB, System Design"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Plan...
                </>
              ) : (
                <>
                  <span>🚀</span> Generate Roadmap
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleGenerateValues}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Auto-fill Example
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>

      {roadmap && (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">4-Week Learning Roadmap</h2>
              <p className="text-indigo-600 font-medium">Target: {roadmap.targetRole}</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-bold text-gray-800 text-lg">4 Weeks</div>
            </div>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-12">
              {['week1', 'week2', 'week3', 'week4'].map((weekKey, index) => {
                const weekData = roadmap.roadmap[weekKey];
                return (
                  <div key={weekKey} className="relative pl-12 group">
                    {/* Circle Marker */}
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white bg-indigo-600 shadow-md flex items-center justify-center text-white font-bold text-sm z-10 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 group-hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize">Week {index + 1}: {weekData.focus}</h3>

                      {weekData.tasks.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">Review and consolidation week.</p>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {weekData.tasks.map((task, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${task.type === 'Learning' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                  {task.type}
                                </span>
                                <h4 className="font-bold text-gray-800">{task.skillName}</h4>
                              </div>

                              {task.topics && task.topics.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Topics</p>
                                  <div className="flex flex-wrap gap-2">
                                    {task.topics.map((t, idx) => (
                                      <span key={idx} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {task.practice && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Practical Task</p>
                                  <p className="text-sm text-gray-700 italic border-l-2 border-purple-400 pl-3">
                                    "{task.practice.title}" - {task.practice.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
