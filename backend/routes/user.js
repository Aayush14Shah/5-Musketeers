const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const SkillFramework = require('../models/SkillFramework');
const { protect } = require('../middleware/auth');

// @route   GET /api/user/profile
// @desc    Get current user profile with student data
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    let studentProfile = null;
    if (user.role === 'student') {
      studentProfile = await StudentProfile.findOne({ userId: user._id });
    }

    res.json({
      user,
      profile: studentProfile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Helper function to normalize skill names for comparison
const normalizeSkillName = (skillName) => {
  return skillName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Helper function to check if two skills match
const skillsMatch = (skill1, skill2) => {
  const normalized1 = normalizeSkillName(skill1);
  const normalized2 = normalizeSkillName(skill2);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (for variations like "ML" vs "Machine Learning")
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    // Only consider it a match if the shorter one is at least 3 characters
    const shorter = normalized1.length < normalized2.length ? normalized1 : normalized2;
    if (shorter.length >= 3) return true;
  }
  
  return false;
};

// @route   POST /api/user/skill-gap
// @desc    Analyze skill gap for a specific role
// @access  Private
router.post('/skill-gap', protect, async (req, res) => {
  try {
    const { roleId, roleName, domain } = req.body;

    if (!roleId && !roleName) {
      return res.status(400).json({ message: 'roleId or roleName is required' });
    }

    // Find the skill framework
    let framework;
    if (roleId) {
      framework = await SkillFramework.findById(roleId);
    } else {
      const query = { roleName: { $regex: roleName, $options: 'i' } };
      if (domain) {
        query.domain = domain.toLowerCase();
      }
      framework = await SkillFramework.findOne(query);
    }

    if (!framework) {
      return res.status(404).json({ message: 'Skill framework not found for this role' });
    }

    // Get user's student profile
    const user = await User.findById(req.user._id);
    const studentProfile = await StudentProfile.findOne({ userId: req.user._id });

    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get user's skills
    const userSkills = studentProfile.skills || [];
    const userSkillNames = userSkills.map(skill => skill.name);

    // Required skills from framework
    const requiredSkills = framework.skills || [];

    // Analyze gaps
    const matchedSkills = [];
    const missingSkills = {
      easy: [],
      medium: [],
      hard: [],
    };

    // Compare each required skill
    requiredSkills.forEach((requiredSkill) => {
      const isMatched = userSkillNames.some((userSkillName) =>
        skillsMatch(userSkillName, requiredSkill.name)
      );

      if (isMatched) {
        matchedSkills.push(requiredSkill);
      } else {
        // Add to missing skills based on category
        if (requiredSkill.category === 'easy') {
          missingSkills.easy.push(requiredSkill);
        } else if (requiredSkill.category === 'medium') {
          missingSkills.medium.push(requiredSkill);
        } else {
          missingSkills.hard.push(requiredSkill);
        }
      }
    });

    // Calculate statistics
    const totalRequired = requiredSkills.length;
    const totalMatched = matchedSkills.length;
    const totalMissing = totalRequired - totalMatched;
    const progressPercentage = totalRequired > 0 
      ? Math.round((totalMatched / totalRequired) * 100) 
      : 0;

    // Count missing skills by category
    const missingEasy = missingSkills.easy.length;
    const missingMedium = missingSkills.medium.length;
    const missingHard = missingSkills.hard.length;

    // Generate summary message
    const summaryParts = [];
    if (missingHard > 0) summaryParts.push(`${missingHard} hard skill${missingHard > 1 ? 's' : ''}`);
    if (missingMedium > 0) summaryParts.push(`${missingMedium} medium skill${missingMedium > 1 ? 's' : ''}`);
    if (missingEasy > 0) summaryParts.push(`${missingEasy} easy skill${missingEasy > 1 ? 's' : ''}`);

    const summaryMessage = summaryParts.length > 0
      ? `You are missing ${summaryParts.join(', ')} for this role.`
      : 'Congratulations! You have all the required skills for this role.';

    // Generate recommendations
    const recommendations = [];
    if (missingHard > 0) {
      recommendations.push(`Focus on learning ${missingHard} advanced skill${missingHard > 1 ? 's' : ''} to excel in this role.`);
    }
    if (missingMedium > 0) {
      recommendations.push(`Consider developing ${missingMedium} intermediate skill${missingMedium > 1 ? 's' : ''} to strengthen your profile.`);
    }
    if (missingEasy > 0) {
      recommendations.push(`Start with ${missingEasy} foundational skill${missingEasy > 1 ? 's' : ''} to build a solid base.`);
    }
    if (summaryParts.length === 0) {
      recommendations.push('You\'re well-prepared! Consider exploring advanced specializations.');
    }

    // Build gap analysis by category
    const gapAnalysis = {
      easy: {
        required: requiredSkills.filter(s => s.category === 'easy').length,
        has: matchedSkills.filter(s => s.category === 'easy').length,
        missing: missingEasy,
        missingSkills: missingSkills.easy.map(s => ({
          name: s.name,
          importance: s.importance,
        })),
      },
      medium: {
        required: requiredSkills.filter(s => s.category === 'medium').length,
        has: matchedSkills.filter(s => s.category === 'medium').length,
        missing: missingMedium,
        missingSkills: missingSkills.medium.map(s => ({
          name: s.name,
          importance: s.importance,
        })),
      },
      hard: {
        required: requiredSkills.filter(s => s.category === 'hard').length,
        has: matchedSkills.filter(s => s.category === 'hard').length,
        missing: missingHard,
        missingSkills: missingSkills.hard.map(s => ({
          name: s.name,
          importance: s.importance,
        })),
      },
    };

    res.json({
      roleName: framework.roleName,
      domain: framework.domain,
      totalRequiredSkills: totalRequired,
      userHasSkills: totalMatched,
      missingSkills: totalMissing,
      progressPercentage,
      summaryMessage,
      gapAnalysis,
      recommendations,
      matchedSkills: matchedSkills.map(s => ({
        name: s.name,
        category: s.category,
        importance: s.importance,
      })),
    });
  } catch (error) {
    console.error('Error analyzing skill gap:', error);
    res.status(500).json({ message: 'Error analyzing skill gap', error: error.message });
  }
});

// @route   GET /api/user/frameworks
// @desc    Get all available skill frameworks for user to select
// @access  Private
router.get('/frameworks', protect, async (req, res) => {
  try {
    const { domain } = req.query;
    const query = {};
    
    if (domain) {
      query.domain = domain.toLowerCase();
    }

    const frameworks = await SkillFramework.find(query)
      .select('roleName domain totalSkills')
      .sort({ roleName: 1, domain: 1 })
      .limit(500);

    res.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    res.status(500).json({ message: 'Error fetching frameworks', error: error.message });
  }
});

module.exports = router;
