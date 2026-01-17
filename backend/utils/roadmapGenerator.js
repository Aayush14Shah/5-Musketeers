const SkillRoadmap = require('../models/SkillRoadmap');

/**
 * Curated resources for common technologies to ensure high quality links.
 */
const CURATED_RESOURCES = {
    // MERN Stack
    'mongodb': {
        resources: [
            { title: 'MongoDB Official University', url: 'https://learn.mongodb.com/', type: 'course' },
            { title: 'MongoDB Crash Course (YouTube)', url: 'https://www.youtube.com/watch?v=ofme2o29ngU', type: 'video' },
            { title: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/', type: 'documentation' }
        ],
        topics: ['Schemas & Models', 'CRUD Operations', 'Aggregation Pipeline', 'Indexing & Performance'],
        practice: { title: 'Database Design', description: 'Design a schema for an E-commerce application with Users, Products, and Orders.' }
    },
    'express': {
        resources: [
            { title: 'Express.js Validation Guide', url: 'https://expressjs.com/en/guide/routing.html', type: 'documentation' },
            { title: 'Rest API with Express', url: 'https://www.youtube.com/watch?v=fgTGADljAeg', type: 'video' }
        ],
        topics: ['Routing & Middleware', 'Error Handling', 'Authentication (JWT)', 'API Security'],
        practice: { title: 'Build a REST API', description: 'Create CRUD endpoints for a blog post service with validation.' }
    },
    'react': {
        resources: [
            { title: 'React Official Docs (Beta)', url: 'https://react.dev/learn', type: 'documentation' },
            { title: 'React Pattern Patterns', url: 'https://www.patterns.dev/posts/react-patterns/', type: 'article' }
        ],
        topics: ['Hooks (useState, useEffect)', 'Context API', 'State Management (Redux/Zustand)', 'Performance Optimization'],
        practice: { title: 'Interactive Dashboard', description: 'Build a dashboard with dynamic charts and data fetching.' }
    },
    'nodejs': {
        resources: [
            { title: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'article' },
            { title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', type: 'video' }
        ],
        topics: ['Event Loop & Async', 'File System (fs)', 'Streams & Buffers', 'Modules (CommonJS vs ES6)'],
        practice: { title: 'CLI Tool', description: 'Build a command-line tool to batch rename files.' }
    },
    'redux': {
        resources: [
            { title: 'Redux Toolkit Docs', url: 'https://redux-toolkit.js.org/introduction/getting-started', type: 'documentation' }
        ],
        topics: ['Store Setup', 'Slices & Reducers', 'Redux Thunk/Saga', 'Selectors'],
        practice: { title: 'Shopping Cart', description: 'Implement a shopping cart with persistent state.' }
    },
    'system design': {
        resources: [
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' }
        ],
        topics: ['Scalability', 'Load Balancing', 'Caching Strategies', 'Database Sharding'],
        practice: { title: 'Design Twitter', description: 'Draw the architecture for a Twitter-like feed system.' }
    }
};

/**
 * Normalizes skill name for consistent matching
 */
const normalizeSkill = (skill) => {
    return skill.toLowerCase().trim().replace(/[^a-z0-9]/g, ''); // Removed space from regex to match keys better
};

/**
 * Generate a 4-week roadmap for missing skills
 * @param {Array} missingSkills - List of skill names missing
 * @param {String} targetRole - The role user is aiming for
 * @returns {Object} 4-week structured plan
 */
const generateRoadmap = async (missingSkills, targetRole) => {
    try {
        // 1. Fetch metadata (DB + Curated fallback)
        const skillDocs = await SkillRoadmap.find({
            skill: { $in: missingSkills.map(s => new RegExp(normalizeSkill(s), 'i')) }
        });

        const dbSkillMap = {};
        skillDocs.forEach(doc => {
            dbSkillMap[normalizeSkill(doc.skill)] = doc;
        });

        const prioritizedSkills = missingSkills.map(skill => {
            const normalized = normalizeSkill(skill);

            // Priority: DB > Curated > Default
            let meta = dbSkillMap[normalized];

            if (!meta && CURATED_RESOURCES[normalized]) {
                meta = {
                    skill: skill,
                    ...CURATED_RESOURCES[normalized]
                };
            }

            // Fallback for completely unknown skills
            if (!meta) {
                // Contextual Google Links to prevent bad results
                const context = targetRole || 'software development';
                meta = {
                    skill: skill,
                    priority: 'core',
                    topics: [`${skill} Fundamentals`, `${skill} Best Practices`, `Advanced ${skill}`],
                    resources: [
                        { title: `${skill} Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`, type: 'documentation' },
                        { title: `${skill} Crash Course`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial ' + context)}`, type: 'video' }
                    ],
                    practiceTask: { title: 'Mini Project', description: `Create a small project demonstrating ${skill} usage.` }
                };
            }

            return meta;
        });

        // 2. Distribute Logic
        const roadmap = {
            week1: { focus: 'Foundation & Core Concepts', tasks: [] },
            week2: { focus: 'Deep Dive & Implementation', tasks: [] },
            week3: { focus: 'Advanced Topics & Integration', tasks: [] },
            week4: { focus: 'Final Projects & Polish', tasks: [] }
        };

        const totalSkills = prioritizedSkills.length;

        if (totalSkills === 1) {
            // Special Case: Single Skill Layout (Spread topics across weeks)
            const skill = prioritizedSkills[0];
            const allTopics = skill.topics || ['Basics', 'Intermediate', 'Advanced', 'Project'];

            roadmap.week1.tasks.push({ ...skill, type: 'Learning', topics: [allTopics[0]] });
            roadmap.week1.focus = `Introduction to ${skill.skill}`;

            roadmap.week2.tasks.push({ ...skill, type: 'Practice', topics: [allTopics[1] || 'Core Features'], practice: { title: `${skill.skill} Practice`, description: 'Apply core concepts.' } });
            roadmap.week2.focus = `${skill.skill} Core Logic`;

            roadmap.week3.tasks.push({ ...skill, type: 'Deep Dive', topics: [allTopics[2] || 'Advanced'], resources: skill.resources });
            roadmap.week3.focus = `Advanced ${skill.skill}`;

            roadmap.week4.tasks.push({ ...skill, type: 'Project', topics: ['Integration', 'Deployment'], practice: skill.practiceTask });
            roadmap.week4.focus = `Final ${skill.skill} Project`;

        } else if (totalSkills <= 2) {
            // Split 2 skills across 4 weeks (2 weeks each)
            prioritizedSkills.forEach((skill, idx) => {
                const startWeek = idx * 2; // 0 or 2
                const weekKeys = Object.keys(roadmap);

                roadmap[weekKeys[startWeek]].tasks.push({ ...skill, type: 'Learning', topics: skill.topics.slice(0, 2) });
                roadmap[weekKeys[startWeek]].focus = `Learn ${skill.skill}`;

                roadmap[weekKeys[startWeek + 1]].tasks.push({ ...skill, type: 'Project', topics: skill.topics.slice(2), practice: skill.practiceTask });
                roadmap[weekKeys[startWeek + 1]].focus = `Practice ${skill.skill}`;
            });
        } else {
            // Standard Distribute
            prioritizedSkills.forEach((skill, index) => {
                let weekKey;
                const progress = (index / totalSkills); // 0 to 1

                if (progress < 0.25) weekKey = 'week1';
                else if (progress < 0.5) weekKey = 'week2';
                else if (progress < 0.75) weekKey = 'week3';
                else weekKey = 'week4';

                roadmap[weekKey].tasks.push({
                    skillName: skill.skill,
                    topics: skill.topics.slice(0, 3),
                    resources: skill.resources,
                    practice: skill.practiceTask,
                    type: 'Learning'
                });
            });
        }

        // Final Cleanup: Handle empty weeks if any (fallback)
        Object.keys(roadmap).forEach((week, idx) => {
            if (roadmap[week].tasks.length === 0) {
                const prevWeek = roadmap[Object.keys(roadmap)[idx - 1]];
                const focusSkill = prevWeek && prevWeek.tasks[0] ? prevWeek.tasks[0].skillName : targetRole;

                roadmap[week].focus = `Review & Refine ${focusSkill}`;
                roadmap[week].tasks.push({
                    skillName: 'Integration & Review',
                    topics: [`Review ${focusSkill}`, 'Refactoring', 'Optimization'],
                    resources: [],
                    practice: { title: 'Code Review', description: `Review your code for ${focusSkill} and clean it up.` },
                    type: 'Review'
                });
            }
        });

        return {
            targetRole,
            duration: '4 Weeks',
            roadmap
        };

    } catch (error) {
        console.error('Error generating roadmap:', error);
        throw error;
    }
};

module.exports = { generateRoadmap };
