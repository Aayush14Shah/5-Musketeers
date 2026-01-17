const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');

let coursesData = [];

const loadCoursesData = () => {
  try {
    const csvPath = path.join(__dirname, '../data/courses.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');

    coursesData = lines.slice(1).map((line, index) => {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const course = {};
      headers.forEach((header, i) => {
        course[header.trim()] = values[i] || '';
      });

      course.skills = course.skills ? course.skills.split(';').map(s => s.trim().toLowerCase()) : [];
      course.rating = parseFloat(course.rating) || 0;
      course.reviews_count = parseInt(course.reviews_count) || 0;
      course.duration_hours = parseInt(course.duration_hours) || 0;

      return course;
    });

    console.log(`Loaded ${coursesData.length} courses from CSV`);
  } catch (error) {
    console.error('Error loading courses data:', error);
    coursesData = [];
  }
};

loadCoursesData();

const normalizeSkillName = (skillName) => {
  return skillName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

const calculateTFIDF = (skillsArray, allSkillsVocab) => {
  const vector = new Array(allSkillsVocab.length).fill(0);
  const skillCounts = {};

  skillsArray.forEach(skill => {
    const normalized = normalizeSkillName(skill);
    skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;
  });

  allSkillsVocab.forEach((skill, index) => {
    const normalized = normalizeSkillName(skill);
    if (skillCounts[normalized]) {
      const tf = skillCounts[normalized] / skillsArray.length;
      const docsWithSkill = coursesData.filter(c =>
        c.skills.some(s => normalizeSkillName(s) === normalized)
      ).length;
      const idf = Math.log((coursesData.length + 1) / (docsWithSkill + 1)) + 1;
      vector[index] = tf * idf;
    }
  });

  return vector;
};

const cosineSimilarity = (vec1, vec2) => {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

const skillMatchScore = (courseSkills, targetSkills) => {
  const normalizedCourse = courseSkills.map(normalizeSkillName);
  const normalizedTarget = targetSkills.map(normalizeSkillName);

  let matches = 0;
  let partialMatches = 0;

  normalizedTarget.forEach(targetSkill => {
    if (normalizedCourse.includes(targetSkill)) {
      matches++;
    } else {
      const partial = normalizedCourse.some(courseSkill =>
        courseSkill.includes(targetSkill) || targetSkill.includes(courseSkill)
      );
      if (partial) partialMatches += 0.5;
    }
  });

  return (matches + partialMatches) / normalizedTarget.length;
};

const calculateHybridScore = (course, missingSkills, userPreferences = {}) => {
  const skillMatch = skillMatchScore(course.skills, missingSkills);

  const allSkills = [...new Set(coursesData.flatMap(c => c.skills))];
  const courseVector = calculateTFIDF(course.skills, allSkills);
  const targetVector = calculateTFIDF(missingSkills, allSkills);
  const contentSimilarity = cosineSimilarity(courseVector, targetVector);

  const normalizedRating = course.rating / 5;
  const maxReviews = Math.max(...coursesData.map(c => c.reviews_count));
  const normalizedPopularity = Math.log(course.reviews_count + 1) / Math.log(maxReviews + 1);

  let difficultyScore = 0.5;
  if (userPreferences.preferredDifficulty) {
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const prefLevel = difficultyMap[userPreferences.preferredDifficulty] || 2;
    const courseLevel = difficultyMap[course.difficulty] || 2;
    difficultyScore = 1 - Math.abs(prefLevel - courseLevel) / 2;
  }

  const weights = {
    skillMatch: 0.35,
    contentSimilarity: 0.25,
    rating: 0.15,
    popularity: 0.10,
    difficulty: 0.15
  };

  const hybridScore =
    weights.skillMatch * skillMatch +
    weights.contentSimilarity * contentSimilarity +
    weights.rating * normalizedRating +
    weights.popularity * normalizedPopularity +
    weights.difficulty * difficultyScore;

  return {
    score: hybridScore,
    breakdown: {
      skillMatch: (skillMatch * 100).toFixed(1),
      contentSimilarity: (contentSimilarity * 100).toFixed(1),
      rating: (normalizedRating * 100).toFixed(1),
      popularity: (normalizedPopularity * 100).toFixed(1),
      difficultyMatch: (difficultyScore * 100).toFixed(1)
    }
  };
};

router.post('/recommend', protect, async (req, res) => {
  try {
    const { missingSkills, domain, difficulty, limit = 10 } = req.body;

    if (!missingSkills || !Array.isArray(missingSkills) || missingSkills.length === 0) {
      return res.status(400).json({ message: 'Missing skills array is required' });
    }

    let filteredCourses = [...coursesData];

    if (domain && domain !== 'all') {
      filteredCourses = filteredCourses.filter(c =>
        c.domain.toLowerCase() === domain.toLowerCase()
      );
    }

    const userPreferences = { preferredDifficulty: difficulty };

    const scoredCourses = filteredCourses.map(course => {
      const { score, breakdown } = calculateHybridScore(course, missingSkills, userPreferences);
      return {
        ...course,
        relevanceScore: score,
        scoreBreakdown: breakdown,
        matchedSkills: course.skills.filter(s =>
          missingSkills.some(ms =>
            normalizeSkillName(s) === normalizeSkillName(ms) ||
            normalizeSkillName(s).includes(normalizeSkillName(ms)) ||
            normalizeSkillName(ms).includes(normalizeSkillName(s))
          )
        )
      };
    });

    const recommendations = scoredCourses
      .filter(c => c.relevanceScore > 0.1)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, parseInt(limit));

    res.json({
      recommendations,
      totalCourses: coursesData.length,
      filteredCount: filteredCourses.length,
      algorithm: 'hybrid_content_based_filtering',
      factors: [
        'TF-IDF skill matching',
        'Cosine similarity',
        'Course rating',
        'Popularity score',
        'Difficulty alignment'
      ]
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

router.get('/courses', protect, async (req, res) => {
  try {
    const { domain, difficulty, platform, search, page = 1, limit = 20 } = req.query;

    let filtered = [...coursesData];

    if (domain && domain !== 'all') {
      filtered = filtered.filter(c => c.domain.toLowerCase() === domain.toLowerCase());
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(c => c.difficulty === difficulty);
    }

    if (platform && platform !== 'all') {
      filtered = filtered.filter(c => c.platform.toLowerCase() === platform.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchLower) ||
        c.skills.some(s => s.includes(searchLower)) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      courses: paginated,
      total: filtered.length,
      page: parseInt(page),
      totalPages: Math.ceil(filtered.length / limit)
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const domains = [...new Set(coursesData.map(c => c.domain))];
    const platforms = [...new Set(coursesData.map(c => c.platform))];
    const difficulties = [...new Set(coursesData.map(c => c.difficulty))];

    const domainStats = domains.map(domain => ({
      domain,
      count: coursesData.filter(c => c.domain === domain).length
    }));

    const platformStats = platforms.map(platform => ({
      platform,
      count: coursesData.filter(c => c.platform === platform).length
    }));

    res.json({
      totalCourses: coursesData.length,
      domains: domainStats,
      platforms: platformStats,
      difficulties
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

const { generateRoadmap } = require('../utils/roadmapGenerator');
const SkillRoadmap = require('../models/SkillRoadmap'); // Import model for seeding/admin use

// ... existing code ...

router.post('/personalized', protect, async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ userId: req.user._id });

    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const userSkills = studentProfile.skills.map(s => s.name.toLowerCase());

    const scoredCourses = coursesData.map(course => {
      const newSkillsToLearn = course.skills.filter(s => !userSkills.includes(normalizeSkillName(s)));
      const hasPrerequisites = course.skills.some(s => userSkills.includes(normalizeSkillName(s)));

      let score = 0;
      score += newSkillsToLearn.length * 0.3;
      score += hasPrerequisites ? 0.2 : 0;
      score += (course.rating / 5) * 0.3;
      score += (Math.log(course.reviews_count + 1) / 15) * 0.2;

      return {
        ...course,
        personalizedScore: score,
        newSkillsCount: newSkillsToLearn.length,
        newSkills: newSkillsToLearn.slice(0, 5)
      };
    });

    const recommendations = scoredCourses
      .filter(c => c.newSkillsCount > 0)
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, 10);

    res.json({
      recommendations,
      userSkillsCount: userSkills.length,
      algorithm: 'personalized_collaborative_filtering'
    });
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

// @desc    Generate 4-week roadmap
// @route   POST /api/recommendations/roadmap
// @access  Private
router.post('/roadmap', protect, async (req, res) => {
  try {
    const { missingSkills, targetRole } = req.body;

    if (!missingSkills || !Array.isArray(missingSkills) || missingSkills.length === 0) {
      return res.status(400).json({ message: 'Missing skills array is required' });
    }

    const roadmap = await generateRoadmap(missingSkills, targetRole || 'Desired Role');
    res.json(roadmap);
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ message: 'Error generating roadmap', error: error.message });
  }
});

// @desc    Get all roadmap metadata (For Testing/Admin)
// @route   GET /api/recommendations/roadmap/metadata
// @access  Private
router.get('/roadmap/metadata', protect, async (req, res) => {
  try {
    const metadata = await SkillRoadmap.find({});
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metadata' });
  }
});

module.exports = router;
