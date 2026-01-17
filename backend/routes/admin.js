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
  
  // Remove common patterns like "100% Remote |", "Commission-Based", etc.
  let cleaned = jobTitle.trim();
  
  // Remove patterns like "100% Remote |" or "Remote |"
  cleaned = cleaned.replace(/^\d+%\s*Remote\s*\|\s*/i, '');
  cleaned = cleaned.replace(/^Remote\s*\|\s*/i, '');
  
  // Remove patterns after "|" (descriptions)
  if (cleaned.includes('|')) {
    const parts = cleaned.split('|');
    // Take the first part which is usually the job title
    cleaned = parts[0].trim();
  }
  
  // Remove common suffixes like "- B2B Sales", "Commission-Based", etc.
  cleaned = cleaned.replace(/\s*-\s*[^-]+$/, ''); // Remove "- something" at the end
  cleaned = cleaned.replace(/\s*\([^)]+\)$/, ''); // Remove "(something)" at the end
  
  return cleaned.trim();
};

// Helper function to parse skills from a string (comma-separated)
// Handles brackets, quotes, and other formatting
const parseSkills = (skillString) => {
  if (!skillString || typeof skillString !== 'string') return [];
  
  // Remove brackets and quotes
  let cleaned = skillString
    .replace(/[\[\]'"]/g, '') // Remove brackets and quotes
    .trim();
  
  // Split by comma and clean each skill
  return cleaned
    .split(',')
    .map((skill) => {
      // Remove any remaining brackets, quotes, or extra whitespace
      return skill
        .replace(/[\[\]'"]/g, '')
        .trim();
    })
    .filter((skill) => skill.length > 0 && skill !== '[]' && skill !== 'null');
};

// @route   POST /api/admin/upload-csv
// @desc    Upload CSV file and extract categories + generate skill frameworks
// @access  Private/Admin
router.post('/upload-csv', protect, admin, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
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

            if (jobTitle && domain) {
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

              // If job_skill_set exists, parse it (it might contain structured data)
              // Otherwise, use individual columns
              if (jobSkillSetKey && row[jobSkillSetKey]) {
                // Try to parse job_skill_set - it might be JSON or structured text
                try {
                  const skillSetData = JSON.parse(row[jobSkillSetKey]);
                  if (skillSetData.easy_skills) {
                    const easySkills = Array.isArray(skillSetData.easy_skills) 
                      ? skillSetData.easy_skills 
                      : parseSkills(skillSetData.easy_skills);
                    easySkills.forEach((skill) => {
                      skills.push({
                        name: String(skill).trim(),
                        importance: 2,
                        category: 'easy',
                      });
                    });
                  }
                  if (skillSetData.medium_skills) {
                    const mediumSkills = Array.isArray(skillSetData.medium_skills)
                      ? skillSetData.medium_skills
                      : parseSkills(skillSetData.medium_skills);
                    mediumSkills.forEach((skill) => {
                      skills.push({
                        name: String(skill).trim(),
                        importance: 3,
                        category: 'medium',
                      });
                    });
                  }
                  if (skillSetData.hard_skills) {
                    const hardSkills = Array.isArray(skillSetData.hard_skills)
                      ? skillSetData.hard_skills
                      : parseSkills(skillSetData.hard_skills);
                    hardSkills.forEach((skill) => {
                      skills.push({
                        name: String(skill).trim(),
                        importance: 5,
                        category: 'hard',
                      });
                    });
                  }
                } catch (e) {
                  // If not JSON, treat as regular text and parse normally
                  // This will be handled by individual column parsing below
                }
              }

              // Parse easy skills (importance = 2) - if not already parsed from job_skill_set
              if (!jobSkillSetKey && easySkillsKey && row[easySkillsKey]) {
                const easySkills = parseSkills(row[easySkillsKey]);
                easySkills.forEach((skill) => {
                  skills.push({
                    name: skill,
                    importance: 2,
                    category: 'easy',
                  });
                });
              }

              // Parse medium skills (importance = 3) - if not already parsed from job_skill_set
              if (!jobSkillSetKey && mediumSkillsKey && row[mediumSkillsKey]) {
                const mediumSkills = parseSkills(row[mediumSkillsKey]);
                mediumSkills.forEach((skill) => {
                  skills.push({
                    name: skill,
                    importance: 3,
                    category: 'medium',
                  });
                });
              }

              // Parse hard skills (importance = 5) - if not already parsed from job_skill_set
              if (!jobSkillSetKey && hardSkillsKey && row[hardSkillsKey]) {
                const hardSkills = parseSkills(row[hardSkillsKey]);
                hardSkills.forEach((skill) => {
                  skills.push({
                    name: skill,
                    importance: 5,
                    category: 'hard',
                  });
                });
              }

              // Only add framework if it has at least one skill
              if (skills.length > 0) {
                frameworksData.push({
                  roleName: jobTitle,
                  domain: domain,
                  skills: skills,
                });
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

module.exports = router;
