import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const TrendsView = ({ user }) => {
    const [emergingTrends, setEmergingTrends] = useState([]);
    const [skillTrends, setSkillTrends] = useState([]);
    const [roleTrends, setRoleTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [verificationLinks, setVerificationLinks] = useState([]);

    useEffect(() => {
        fetchTrends();
    }, []);

    const fetchTrends = async () => {
        try {
            setLoading(true);
            const [emergingRes, skillsRes, rolesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/trends/emerging'),
                axios.get('http://localhost:5000/api/trends/skills'),
                axios.get('http://localhost:5000/api/trends/roles')
            ]);

            setEmergingTrends(emergingRes.data);
            setSkillTrends(skillsRes.data);
            setRoleTrends(rolesRes.data);

            const savedLinks = localStorage.getItem('trendVerificationLinks');
            if (savedLinks) setVerificationLinks(JSON.parse(savedLinks));

            setLastRefreshed(new Date());
        } catch (error) {
            console.error("Error fetching trends:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setVerificationLinks([]);

            const payload = {
                domain: user?.domainInterest || ''
            };

            const response = await axios.post('http://localhost:5000/api/trends/refresh', payload);

            if (response.data.data.sourceLinks) {
                setVerificationLinks(response.data.data.sourceLinks);
                localStorage.setItem('trendVerificationLinks', JSON.stringify(response.data.data.sourceLinks));
            }

            await fetchTrends();
        } catch (error) {
            console.error("Error refreshing trends:", error);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading && !emergingTrends.length) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const TrendCard = ({ trend, colorClass, icon }) => (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-${colorClass}-100 hover:shadow-md transition-all group relative`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <h4 className="font-bold text-gray-800 text-sm">{trend.name}</h4>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-black ${trend.trendScore >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.trendScore > 0 ? '+' : ''}{(trend.trendScore * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-gray-500">
                    <span className={`font-bold text-${colorClass}-600 text-base`}>
                        {trend.currentCount.toLocaleString()}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wide">Est. Demand</span>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-col gap-1 items-end">
                    {trend.locations && trend.locations.length > 0 && (
                        <span className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-600 border border-gray-100 max-w-[100px] truncate" title={trend.locations.join(', ')}>
                            📍 {trend.locations[0]}
                        </span>
                    )}
                    {trend.platforms && trend.platforms.length > 0 && (
                        <span className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-600 border border-gray-100 max-w-[100px] truncate" title={trend.platforms.join(', ')}>
                            🌐 {trend.platforms[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Real-Time Market Trends
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Live analysis of job market demand.
                    </p>
                    {user?.domainInterest && (
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                            🎯 Personalized for: {user.domainInterest.replace(/-/g, ' ')}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-medium ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {refreshing ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <span>🔄</span> Refresh
                        </>
                    )}
                </button>
            </div>

            {/* Verification Section */}
            {verificationLinks.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                    <h4 className="font-bold text-green-800 flex items-center gap-2 mb-1">
                        <span>✅</span> Verified Real-Time Data Sources
                    </h4>
                    <p className="text-green-700 mb-1">Analysis key sources:</p>
                    <div className="flex flex-wrap gap-2">
                        {verificationLinks.map((link, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded border border-green-100 shadow-sm text-green-700">
                                <b>{link.title}</b> <span className="opacity-75">@ {link.company}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Emerging Trends Section - Compact 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Emerging Skills */}
                <section className="bg-gradient-to-br from-white to-indigo-50/30 p-4 rounded-2xl border border-indigo-100">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <span className="text-lg">⚡</span> Top Emerging Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {emergingTrends.filter(t => t.type === 'skill').length > 0 ? (
                            emergingTrends.filter(t => t.type === 'skill').slice(0, 6).map((trend) => (
                                <TrendCard key={trend._id} trend={trend} colorClass="indigo" icon="⚡" />
                            ))
                        ) : (
                            <div className="col-span-2 p-8 text-center text-gray-400 text-sm italic">
                                No emerging skills detected yet.
                            </div>
                        )}
                    </div>
                </section>

                {/* Column 2: Emerging Roles */}
                <section className="bg-gradient-to-br from-white to-purple-50/30 p-4 rounded-2xl border border-purple-100">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-purple-100 pb-2">
                        <span className="text-lg">🚀</span> Top Emerging Roles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {emergingTrends.filter(t => t.type === 'role').length > 0 ? (
                            emergingTrends.filter(t => t.type === 'role').slice(0, 6).map((trend) => (
                                <TrendCard key={trend._id} trend={trend} colorClass="purple" icon="🚀" />
                            ))
                        ) : (
                            <div className="col-span-2 p-8 text-center text-gray-400 text-sm italic">
                                No emerging roles detected yet.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Skill Market Demand
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={skillTrends.slice(0, 8)} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    interval={0}
                                    angle={-20}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#e0e7ff', opacity: 0.2 }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 border border-indigo-100 shadow-lg rounded-lg">
                                                    <p className="font-bold text-gray-800 mb-1">{label}</p>
                                                    <p className="text-indigo-600 font-semibold text-sm">
                                                        {payload[0].value.toLocaleString()} <span className="text-gray-400 font-normal">listings</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="currentCount" radius={[6, 6, 0, 0]} barSize={40}>
                                    {skillTrends.slice(0, 8).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(245, ${70 + index * 2}%, ${60 - index * 3}%)`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Role Market Demand
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roleTrends.slice(0, 8)} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    interval={0}
                                    angle={-20}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f3e8ff', opacity: 0.2 }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 border border-purple-100 shadow-lg rounded-lg">
                                                    <p className="font-bold text-gray-800 mb-1">{label}</p>
                                                    <p className="text-purple-600 font-semibold text-sm">
                                                        {payload[0].value.toLocaleString()} <span className="text-gray-400 font-normal">active roles</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="currentCount" radius={[6, 6, 0, 0]} barSize={40}>
                                    {roleTrends.slice(0, 8).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(270, ${70 + index * 2}%, ${60 - index * 3}%)`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendsView;
