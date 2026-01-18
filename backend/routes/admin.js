const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Category = require('../models/Category');
const SkillFramework = require('../models/SkillFramework');
const { protect, admin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `data-${Date.now()}.csv`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper function to clean job title (remove descriptions, extra text)
const cleanJobTitle = (jobTitle) => {
  if (!jobTitle || typeof jobTitle !== 'string') return '';
  
  let cleaned = jobTitle.trim();
  
  // If title contains "|", split and take the middle part (usually the actual job title)
  // Format is often: "100% Remote | Job Title | Description"
  if (cleaned.includes('|')) {
    const parts = cleaned.split('|').map(p => p.trim());
    
    // If we have 3 parts, the middle one is usually the job title
    if (parts.length >= 3) {
      cleaned = parts[1]; // Take middle part
    } else if (parts.length === 2) {
      // If only 2 parts, take the one that looks more like a job title
      // Usually the second part is the description, first is the title
      cleaned = parts[0];
    } else {
      cleaned = parts[0];
    }
  }
  
  // Remove common prefixes
  cleaned = cleaned.replace(/^\d+%\s*Remote\s*/i, '');
  cleaned = cleaned.replace(/^Remote\s*/i, '');
  cleaned = cleaned.replace(/^Full[- ]?Time\s*/i, '');
  cleaned = cleaned.replace(/^Part[- ]?Time\s*/i, '');
  cleaned = cleaned.replace(/^Contract\s*/i, '');
  
  // Remove common suffixes and descriptions
  cleaned = cleaned.replace(/\s*-\s*[^-]+$/, ''); // Remove "- something" at the end
  cleaned = cleaned.replace(/\s*\([^)]+\)$/, ''); // Remove "(something)" at the end
  cleaned = cleaned.replace(/\s*\|.*$/, ''); // Remove anything after remaining |
  
  // Remove common job description phrases
  cleaned = cleaned.replace(/\s*(Commission[- ]?Based|High Earning|Full Benefits|Remote Work|On[- ]?Site).*$/i, '');
  cleaned = cleaned.replace(/\s*(Entry Level|Senior|Junior|Lead|Principal).*$/i, '');
  
  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // If cleaned is too short or looks like it's still a description, try to extract better
  if (cleaned.length < 3 || cleaned.toLowerCase().includes('commission') || cleaned.toLowerCase().includes('earning')) {
    // Fallback: try to extract from original
    const originalParts = jobTitle.split('|').map(p => p.trim());
    for (const part of originalParts) {
      // Look for a part that looks like a job title (has common job title words)
      if (part.match(/\b(Manager|Developer|Engineer|Analyst|Specialist|Consultant|Director|Lead|Architect)\b/i)) {
        cleaned = part;
        // Clean it again
        cleaned = cleaned.replace(/\s*-\s*[^-]+$/, '');
        cleaned = cleaned.replace(/\s*\([^)]+\)$/, '');
        cleaned = cleaned.trim();
        break;
      }
    }
  }
  
  return cleaned.trim() || jobTitle.trim(); // Fallback to original if cleaning fails
};

// Helper function to parse skills from a string (comma-separated)
// Handles brackets, quotes, and other formatting
const parseSkills = (skillString) => {
  if (!skillString || typeof skillString !== 'string') return [];
  
  // Check if it's an empty array representation
  const trimmed = skillString.trim();
  if (trimmed === '[]' || trimmed === '' || trimmed === 'null' || trimmed === 'None') {
    return [];
  }
  
  // Remove brackets and quotes
  let cleaned = skillString
    .replace(/^\[|\]$/g, '') // Remove outer brackets
    .replace(/[\[\]'"]/g, '') // Remove all brackets and quotes
    .trim();
  
  // If after cleaning it's empty, return empty array
  if (!cleaned || cleaned === '[]' || cleaned === 'null' || cleaned === 'None') {
    return [];
  }
  
  // Split by comma and clean each skill
  const skills = cleaned
    .split(',')
    .map((skill) => {
      // Remove any remaining brackets, quotes, or extra whitespace
      return skill
        .replace(/[\[\]'"]/g, '')
        .trim();
    })
    .filter((skill) => {
      // Filter out empty strings, null, undefined, and array representations
      return skill.length > 0 && 
             skill !== '[]' && 
             skill !== 'null' && 
             skill !== 'None' &&
             skill !== 'undefined';
    });
  
  return skills;
};

// @route   DELETE /api/admin/clear-data
// @desc    Clear all categories and skill frameworks
// @access  Private/Admin
router.delete('/clear-data', protect, admin, async (req, res) => {
  try {
    // Delete all categories
    const categoriesDeleted = await Category.deleteMany({});
    
    // Delete all skill frameworks
    const frameworksDeleted = await SkillFramework.deleteMany({});
    
    res.json({
      message: 'All data cleared successfully',
      categoriesDeleted: categoriesDeleted.deletedCount,
      frameworksDeleted: frameworksDeleted.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ message: 'Error clearing data', error: error.message });
  }
});

// @route   POST /api/admin/upload-csv
// @desc    Upload CSV file and extract categories + generate skill frameworks
// @access  Private/Admin
router.post('/upload-csv', protect, admin, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const { clearExisting } = req.body;
    const shouldClear = clearExisting === 'true' || clearExisting === true;

    // Clear existing data if requested
    if (shouldClear) {
      try {
        await Category.deleteMany({});
        await SkillFramework.deleteMany({});
        console.log('Existing data cleared before upload');
      } catch (clearError) {
        console.error('Error clearing existing data:', clearError);
        // Continue with upload even if clear fails
      }
    }

    const filePath = req.file.path;
    const categories = new Set();
    const categoryMap = new Map(); // To store category -> displayName mapping
    const frameworksData = []; // Store skill framework data

    // Read and parse CSV file
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Debug: Log row keys to see what columns are available
          // console.log('Row keys:', Object.keys(row));
          
          // Extract categories
          const categoryKey = Object.keys(row).find(
            (key) => key.toLowerCase() === 'category' || key.toLowerCase() === 'domain' || key.toLowerCase() === 'sector'
          );

          if (categoryKey && row[categoryKey]) {
            const categoryValue = row[categoryKey].trim();
            if (categoryValue) {
              categories.add(categoryValue.toLowerCase());
              if (!categoryMap.has(categoryValue.toLowerCase())) {
                categoryMap.set(categoryValue.toLowerCase(), categoryValue);
              }
            }
          }

          // Extract skill framework data
          // Find job_title column (case-insensitive)
          const jobTitleKey = Object.keys(row).find(
            (key) => key.toLowerCase() === 'job_title' || key.toLowerCase() === 'job title' || key.toLowerCase() === 'role'
          );

          if (jobTitleKey && row[jobTitleKey] && categoryKey && row[categoryKey]) {
            // Clean job title - remove descriptions and extra text
            const jobTitle = cleanJobTitle(row[jobTitleKey]);
            const domain = row[categoryKey].trim().toLowerCase();

            // Debug log
            // if (frameworksData.length < 3) {
            //   console.log('Processing row:', { jobTitle, domain, rowKeys: Object.keys(row) });
            // }

            if (jobTitle && domain && jobTitle.length > 2) {
              // Find skill columns - check for job_skill_set first, then individual columns
              const jobSkillSetKey = Object.keys(row).find(
                (key) => key.toLowerCase() === 'job_skill_set' || key.toLowerCase() === 'job skill set'
              );
              
              // Also check for individual skill columns
              const easySkillsKey = Object.keys(row).find(
                (key) => key.toLowerCase() === 'easy_skills' || key.toLowerCase() === 'easy skills'
              );
              const mediumSkillsKey = Object.keys(row).find(
                (key) => key.toLowerCase() === 'medium_skills' || key.toLowerCase() === 'medium skills'
              );
              const hardSkillsKey = Object.keys(row).find(
                (key) => key.toLowerCase() === 'hard_skills' || key.toLowerCase() === 'hard skills'
              );

              const skills = [];
              let usedJobSkillSet = false;

              // If job_skill_set exists, try to parse it (it might contain structured data)
              if (jobSkillSetKey && row[jobSkillSetKey] && row[jobSkillSetKey].trim()) {
                // Try to parse job_skill_set - it might be JSON or structured text
                try {
                  const skillSetData = JSON.parse(row[jobSkillSetKey]);
                  let hasSkills = false;
                  
                  if (skillSetData.easy_skills) {
                    const easySkills = Array.isArray(skillSetData.easy_skills) 
                      ? skillSetData.easy_skills.filter(s => s && String(s).trim() && String(s).trim() !== '[]')
                      : parseSkills(skillSetData.easy_skills);
                    if (easySkills.length > 0) hasSkills = true;
                    easySkills.forEach((skill) => {
                      const skillName = String(skill).trim();
                      if (skillName && skillName !== '[]' && skillName !== 'null') {
                        skills.push({
                          name: skillName,
                          importance: 2,
                          category: 'easy',
                        });
                      }
                    });
                  }
                  if (skillSetData.medium_skills) {
                    const mediumSkills = Array.isArray(skillSetData.medium_skills)
                      ? skillSetData.medium_skills.filter(s => s && String(s).trim() && String(s).trim() !== '[]')
                      : parseSkills(skillSetData.medium_skills);
                    if (mediumSkills.length > 0) hasSkills = true;
                    mediumSkills.forEach((skill) => {
                      const skillName = String(skill).trim();
                      if (skillName && skillName !== '[]' && skillName !== 'null') {
                        skills.push({
                          name: skillName,
                          importance: 3,
                          category: 'medium',
                        });
                      }
                    });
                  }
                  if (skillSetData.hard_skills) {
                    const hardSkills = Array.isArray(skillSetData.hard_skills)
                      ? skillSetData.hard_skills.filter(s => s && String(s).trim() && String(s).trim() !== '[]')
                      : parseSkills(skillSetData.hard_skills);
                    if (hardSkills.length > 0) hasSkills = true;
                    hardSkills.forEach((skill) => {
                      const skillName = String(skill).trim();
                      if (skillName && skillName !== '[]' && skillName !== 'null') {
                        skills.push({
                          name: skillName,
                          importance: 5,
                          category: 'hard',
                        });
                      }
                    });
                  }
                  
                  // If we successfully parsed skills from job_skill_set, mark it as used
                  if (hasSkills) {
                    usedJobSkillSet = true;
                  }
                } catch (e) {
                  // If not JSON or parsing failed, fall through to individual columns
                  usedJobSkillSet = false;
                }
              }

              // Parse individual skill columns - only if job_skill_set wasn't used or doesn't exist
              if (!usedJobSkillSet && easySkillsKey && row[easySkillsKey]) {
                const easySkills = parseSkills(row[easySkillsKey]);
                easySkills.forEach((skill) => {
                  const skillName = skill.trim();
                  if (skillName && skillName !== '[]' && skillName !== 'null') {
                    skills.push({
                      name: skillName,
                      importance: 2,
                      category: 'easy',
                    });
                  }
                });
              }

              // Parse medium skills (importance = 3) - if not already parsed from job_skill_set
              if (!usedJobSkillSet && mediumSkillsKey && row[mediumSkillsKey]) {
                const mediumSkills = parseSkills(row[mediumSkillsKey]);
                mediumSkills.forEach((skill) => {
                  const skillName = skill.trim();
                  if (skillName && skillName !== '[]' && skillName !== 'null') {
                    skills.push({
                      name: skillName,
                      importance: 3,
                      category: 'medium',
                    });
                  }
                });
              }

              // Parse hard skills (importance = 5) - if not already parsed from job_skill_set
              if (!usedJobSkillSet && hardSkillsKey && row[hardSkillsKey]) {
                const hardSkills = parseSkills(row[hardSkillsKey]);
                hardSkills.forEach((skill) => {
                  const skillName = skill.trim();
                  if (skillName && skillName !== '[]' && skillName !== 'null') {
                    skills.push({
                      name: skillName,
                      importance: 5,
                      category: 'hard',
                    });
                  }
                });
              }

              // Only add framework if it has at least one skill
              // Also ensure job title is meaningful (not empty after cleaning)
              if (skills.length > 0 && jobTitle && jobTitle.length > 2) {
                frameworksData.push({
                  roleName: jobTitle,
                  domain: domain,
                  skills: skills,
                });
                
                // Debug: Log first few frameworks
                // if (frameworksData.length <= 3) {
                //   console.log(`Framework ${frameworksData.length}:`, {
                //     roleName: jobTitle,
                //     domain: domain,
                //     skillsCount: skills.length,
                //     easy: skills.filter(s => s.category === 'easy').length,
                //     medium: skills.filter(s => s.category === 'medium').length,
                //     hard: skills.filter(s => s.category === 'hard').length,
                //   });
                // }
              } else {
                // Debug: Log why framework wasn't added
                // if (frameworksData.length < 5) {
                //   console.log('Skipped framework:', {
                //     jobTitle,
                //     domain,
                //     skillsLength: skills.length,
                //     hasTitle: !!jobTitle,
                //     titleLength: jobTitle?.length,
                //   });
                // }
              }
            }
          }
        })
        .on('end', async () => {
          try {
            // Delete the uploaded file after processing
            fs.unlinkSync(filePath);

            // Save categories to database
            const savedCategories = [];
            for (const [key, displayName] of categoryMap) {
              try {
                const category = await Category.findOneAndUpdate(
                  { name: key },
                  { name: key, displayName: displayName },
                  { upsert: true, new: true }
                );
                savedCategories.push(category);
              } catch (error) {
                console.error(`Error saving category ${key}:`, error);
              }
            }

            // Debug: Log frameworks data before saving
            console.log(`Total frameworks parsed: ${frameworksData.length}`);
            if (frameworksData.length > 0) {
              console.log('Sample framework:', {
                roleName: frameworksData[0].roleName,
                domain: frameworksData[0].domain,
                skillsCount: frameworksData[0].skills.length,
              });
            }

            // Generate and save skill frameworks
            const savedFrameworks = [];
            const frameworkErrors = [];

            for (const frameworkData of frameworksData) {
              try {
                // Check if framework already exists (same roleName and domain)
                const existingFramework = await SkillFramework.findOne({
                  roleName: frameworkData.roleName,
                  domain: frameworkData.domain,
                });

                if (existingFramework) {
                  // Update existing framework
                  existingFramework.skills = frameworkData.skills;
                  existingFramework.totalSkills = frameworkData.skills.length;
                  await existingFramework.save();
                  savedFrameworks.push(existingFramework);
                } else {
                  // Create new framework
                  const framework = await SkillFramework.create(frameworkData);
                  savedFrameworks.push(framework);
                }
              } catch (error) {
                console.error(`Error saving framework for ${frameworkData.roleName}:`, error);
                frameworkErrors.push({
                  roleName: frameworkData.roleName,
                  error: error.message,
                });
              }
            }
            
            console.log(`Successfully saved ${savedFrameworks.length} frameworks`);

            res.json({
              message: 'CSV file processed successfully',
              categoriesCount: savedCategories.length,
              categories: savedCategories.map((cat) => ({
                name: cat.name,
                displayName: cat.displayName,
              })),
              frameworksCount: savedFrameworks.length,
              frameworks: savedFrameworks.map((fw) => ({
                id: fw._id,
                roleName: fw.roleName,
                domain: fw.domain,
                totalSkills: fw.totalSkills,
              })),
              errors: frameworkErrors.length > 0 ? frameworkErrors : undefined,
            });
            resolve();
          } catch (error) {
            // Clean up file if still exists
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            reject(error);
          }
        })
        .on('error', (error) => {
          // Clean up file on error
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(error);
        });
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({ message: 'Error processing CSV file', error: error.message });
  }
});

// @route   GET /api/admin/categories
// @desc    Get all categories
// @access  Private/Admin
router.get('/categories', protect, admin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayName: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// @route   GET /api/admin/frameworks
// @desc    Get all skill frameworks
// @access  Private/Admin
router.get('/frameworks', protect, admin, async (req, res) => {
  try {
    const { domain, roleName } = req.query;
    const query = {};
    
    if (domain) {
      query.domain = domain.toLowerCase();
    }
    if (roleName) {
      query.roleName = { $regex: roleName, $options: 'i' };
    }

    const frameworks = await SkillFramework.find(query)
      .sort({ roleName: 1, domain: 1 })
      .limit(100); // Limit to prevent huge responses
    
    res.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    res.status(500).json({ message: 'Error fetching frameworks', error: error.message });
  }
});

// @route   GET /api/admin/frameworks/:id
// @desc    Get a specific skill framework
// @access  Private/Admin
router.get('/frameworks/:id', protect, admin, async (req, res) => {
  try {
    const framework = await SkillFramework.findById(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Skill framework not found' });
    }
    
    res.json(framework);
  } catch (error) {
    console.error('Error fetching framework:', error);
    res.status(500).json({ message: 'Error fetching framework', error: error.message });
  }
});

// @route   DELETE /api/admin/frameworks/:id
// @desc    Delete a skill framework
// @access  Private/Admin
router.delete('/frameworks/:id', protect, admin, async (req, res) => {
  try {
    const framework = await SkillFramework.findByIdAndDelete(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Skill framework not found' });
    }
    
    res.json({ message: 'Skill framework deleted successfully', framework });
  } catch (error) {
    console.error('Error deleting framework:', error);
    res.status(500).json({ message: 'Error deleting framework', error: error.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get comprehensive analytics for admin dashboard
// @access  Private/Admin
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const User = require('../models/User');
    const StudentProfile = require('../models/StudentProfile');
    
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProfiles = await StudentProfile.countDocuments();
    const totalFrameworks = await SkillFramework.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Domain distribution for users
    const userDomainStats = await User.aggregate([
      { $match: { domainInterest: { $exists: true, $ne: null } } },
      { $group: { _id: '$domainInterest', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Domain distribution for frameworks
    const frameworkDomainStats = await SkillFramework.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 }, totalSkills: { $sum: '$totalSkills' } } },
      { $sort: { count: -1 } }
    ]);

    // Skills distribution by category across all frameworks
    const skillCategoryStats = await SkillFramework.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills.category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Top roles by skill count
    const topRoles = await SkillFramework.aggregate([
      { $project: { roleName: 1, domain: 1, totalSkills: 1 } },
      { $sort: { totalSkills: -1 } },
      { $limit: 10 }
    ]);

    // User registration over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userRegistrationStats = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Framework creation over time (last 30 days)
    const frameworkCreationStats = await SkillFramework.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Average skills per profile
    const profilesWithSkills = await StudentProfile.aggregate([
      { $project: { skillsCount: { $size: { $ifNull: ['$skills', []] } } } },
      {
        $group: {
          _id: null,
          avgSkills: { $avg: '$skillsCount' },
          maxSkills: { $max: '$skillsCount' },
          minSkills: { $min: '$skillsCount' }
        }
      }
    ]);

    // Skills level distribution
    const skillLevelStats = await StudentProfile.aggregate([
      { $unwind: { path: '$skills', preserveNullAndEmptyArrays: true } },
      { $match: { 'skills.level': { $exists: true } } },
      { $group: { _id: '$skills.level', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Projects by domain
    const projectDomainStats = await StudentProfile.aggregate([
      { $unwind: { path: '$projects', preserveNullAndEmptyArrays: true } },
      { $match: { 'projects.domain': { $exists: true, $ne: null } } },
      { $group: { _id: '$projects.domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalProfiles,
        totalFrameworks,
        totalCategories,
        avgSkillsPerProfile: profilesWithSkills[0]?.avgSkills?.toFixed(1) || 0,
        maxSkillsPerProfile: profilesWithSkills[0]?.maxSkills || 0,
        minSkillsPerProfile: profilesWithSkills[0]?.minSkills || 0
      },
      userDomainDistribution: userDomainStats.map(item => ({
        domain: item._id || 'Not specified',
        count: item.count
      })),
      frameworkDomainDistribution: frameworkDomainStats.map(item => ({
        domain: item._id || 'Unknown',
        frameworks: item.count,
        totalSkills: item.totalSkills
      })),
      skillCategoryDistribution: skillCategoryStats.map(item => ({
        category: item._id || 'Unknown',
        count: item.count
      })),
      topRoles: topRoles.map(item => ({
        roleName: item.roleName,
        domain: item.domain,
        totalSkills: item.totalSkills
      })),
      userRegistrationTrend: userRegistrationStats.map(item => ({
        date: item._id,
        count: item.count
      })),
      frameworkCreationTrend: frameworkCreationStats.map(item => ({
        date: item._id,
        count: item.count
      })),
      skillLevelDistribution: skillLevelStats.map(item => ({
        level: item._id,
        count: item.count
      })),
      projectDomainDistribution: projectDomainStats.map(item => ({
        domain: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;
