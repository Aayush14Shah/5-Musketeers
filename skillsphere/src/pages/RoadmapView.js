import React, { useState, useEffect } from 'react';
import { recommendationAPI, userAPI } from '../services/api';

const RoadmapView = ({ availableDomains = [], frameworks = [], initialRole, initialMissingSkills }) => {
    // Selection State
    const [selectedDomain, setSelectedDomain] = useState('');
    const [roleList, setRoleList] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');

    // Roadmap State
    const [targetRoleName, setTargetRoleName] = useState(initialRole || '');
    const [missingSkills, setMissingSkills] = useState([]); // Array of strings
    const [roadmap, setRoadmap] = useState(null);

    // UI State
    const [loading, setLoading] = useState(false);
    const [analyzingGap, setAnalyzingGap] = useState(false);
    const [error, setError] = useState(null);
    const [newSkillInput, setNewSkillInput] = useState('');

    // Handle Initial Props
    useEffect(() => {
        if (initialRole) setTargetRoleName(initialRole);
        if (initialMissingSkills) {
            // Handle comma sep string or array
            const skills = typeof initialMissingSkills === 'string'
                ? initialMissingSkills.split(',').map(s => s.trim()).filter(s => s)
                : initialMissingSkills;
            setMissingSkills(skills);
        }
    }, [initialRole, initialMissingSkills]);

    // Load roles when domain changes
    useEffect(() => {
        if (selectedDomain) {
            // Filter passed frameworks or fetch if needed
            const filtered = frameworks.filter(f => f.domain === selectedDomain);
            setRoleList(filtered);
        } else {
            setRoleList(frameworks);
        }
    }, [selectedDomain, frameworks]);

    // Fetch Skills when Role is selected
    const handleRoleSelect = async (roleId) => {
        setSelectedRoleId(roleId);
        const role = roleList.find(r => r._id === roleId);
        if (role) setTargetRoleName(role.roleName);

        if (!roleId) return;

        setAnalyzingGap(true);
        try {
            // Re-use the skill gap API to find what's missing for THIS role
            const response = await userAPI.getSkillGap({ roleId });
            const gapData = response.data;

            const missing = [
                ...gapData.gapAnalysis.hard.missingSkills.map(s => s.name),
                ...gapData.gapAnalysis.medium.missingSkills.map(s => s.name),
                ...gapData.gapAnalysis.easy.missingSkills.map(s => s.name)
            ];
            setMissingSkills(missing);
        } catch (err) {
            console.error("Error fetching gap:", err);
            setError("Could not auto-fetch missing skills. Please add them manually.");
        } finally {
            setAnalyzingGap(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (missingSkills.length === 0) {
            setError('Please add at least one missing skill');
            return;
        }

        setLoading(true);
        setError(null);
        setRoadmap(null);

        try {
            const response = await recommendationAPI.generateRoadmap({
                targetRole: targetRoleName,
                missingSkills: missingSkills
            });
            setRoadmap(response.data);
        } catch (err) {
            console.error('Error generating roadmap:', err);
            setError('Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Skill Chip Logic
    const addSkill = (e) => {
        if (e.key === 'Enter' && newSkillInput.trim()) {
            e.preventDefault();
            if (!missingSkills.includes(newSkillInput.trim())) {
                setMissingSkills([...missingSkills, newSkillInput.trim()]);
            }
            setNewSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setMissingSkills(missingSkills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Overview / Formula Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">How We Build Your Roadmap 🧠</h3>
                <p className="text-indigo-800 text-sm mb-4">
                    Our intelligent system analyzes your skill gap using a 3-step formula:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-2xl mb-2">🔍</div>
                        <h4 className="font-bold text-gray-800 text-sm">1. Gap Identification</h4>
                        <p className="text-xs text-gray-500 mt-1">We identify the exact skills missing between your profile and the target role.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-2xl mb-2">⚖️</div>
                        <h4 className="font-bold text-gray-800 text-sm">2. Prioritization</h4>
                        <p className="text-xs text-gray-500 mt-1">Skills are ranked by "Core" vs "Supporting" based on industry standards.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-2xl mb-2">📅</div>
                        <h4 className="font-bold text-gray-800 text-sm">3. Structured Distribution</h4>
                        <p className="text-xs text-gray-500 mt-1">We distribute learning into a 4-week plan, balancing theory and practice.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Generate Your Personal Roadmap</h2>
                <p className="text-gray-600 mb-6 text-sm">
                    Select your target role to auto-detect missing skills, or add them manually.
                </p>

                <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Role Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">1. Select Domain (Optional)</label>
                                <select
                                    value={selectedDomain}
                                    onChange={(e) => setSelectedDomain(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="">All Domains</option>
                                    {availableDomains.map(d => (
                                        <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">2. Target Role</label>
                                <select
                                    value={selectedRoleId}
                                    onChange={(e) => handleRoleSelect(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="">-- Select Role --</option>
                                    {roleList.map(r => (
                                        <option key={r._id} value={r._id}>{r.roleName}</option>
                                    ))}
                                </select>
                                {/* Fallback Text Input if manual entry needed */}
                                <div className="mt-2 text-xs text-right">
                                    <span className="text-gray-500">Or type manually: </span>
                                    <input
                                        type="text"
                                        value={targetRoleName}
                                        onChange={(e) => setTargetRoleName(e.target.value)}
                                        className="border-b border-gray-300 focus:border-indigo-500 outline-none px-1"
                                        placeholder="Custom Role"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                3. Missing Skills needed for Roadmap
                            </label>
                            <div className="border border-gray-300 rounded-lg p-3 min-h-[120px] bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 cursor-text" onClick={() => document.getElementById('skill-input').focus()}>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {missingSkills.map((skill, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium animate-fade-in">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                                                className="ml-1.5 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    id="skill-input"
                                    type="text"
                                    value={newSkillInput}
                                    onChange={(e) => setNewSkillInput(e.target.value)}
                                    onKeyDown={addSkill}
                                    placeholder={missingSkills.length === 0 ? "Type skill & press Enter (e.g. React)..." : ""}
                                    className="outline-none w-full text-sm bg-transparent"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {analyzingGap ? (
                                    <span className="flex items-center gap-1 text-indigo-600">
                                        <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                                        Analyzing skill gap...
                                    </span>
                                ) : (
                                    "Type a skill and press Enter to add. Click × to remove."
                                )}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || missingSkills.length === 0}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Designing Your Detailed Path...
                            </>
                        ) : (
                            <>
                                <span>✨</span> Generate My Detailed Roadmap
                            </>
                        )}
                    </button>

                    {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
                </form>
            </div>

            {roadmap && (
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Learning Journey</h2>
                            <p className="text-indigo-600 font-medium">To become a {roadmap.targetRole}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                            <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                4 Weeks Duration
                            </div>
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
                                                        <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${task.type === 'Learning' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                                    }`}>
                                                                    {task.type}
                                                                </span>
                                                                <h4 className="font-bold text-lg text-gray-800">{task.skillName}</h4>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {/* Topics */}
                                                                {task.topics && task.topics.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Key Topics</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {task.topics.map((t, idx) => (
                                                                                <span key={idx} className="text-sm text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                                                                                    {t}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Actionable / Resources */}
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Action Items</p>

                                                                    {task.practice && (
                                                                        <div className="mb-3 p-3 bg-purple-50 rounded border border-purple-100">
                                                                            <p className="text-xs font-bold text-purple-700 mb-1">Practice Task</p>
                                                                            <p className="text-sm text-gray-800 font-medium">{task.practice.title}</p>
                                                                            <p className="text-xs text-gray-600 mt-0.5">{task.practice.description}</p>
                                                                        </div>
                                                                    )}

                                                                    {task.resources && task.resources.length > 0 ? (
                                                                        <div className="flex gap-2 flex-wrap">
                                                                            {task.resources.map((res, idx) => (
                                                                                <a
                                                                                    key={idx}
                                                                                    href={res.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded"
                                                                                >
                                                                                    <span>🔗</span> {res.title || 'Resource'}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex gap-2">
                                                                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(task.skillName + ' tutorial ' + targetRoleName)}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">
                                                                                📺 YouTube Tutorials
                                                                            </a>
                                                                            <a href={`https://www.google.com/search?q=${encodeURIComponent(task.skillName + ' official documentation')}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
                                                                                📄 Docs
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
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

export default RoadmapView;
