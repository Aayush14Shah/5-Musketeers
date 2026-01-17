const express = require('express');
const router = express.Router();
const SkillFramework = require('../models/SkillFramework');

// @route   GET /api/frameworks
// @desc    Get all skill frameworks (public for users)
// @access  Public
router.get('/', async (req, res) => {
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
      .select('roleName domain totalSkills skills.name skills.importance skills.category')
      .sort({ roleName: 1, domain: 1 })
      .limit(100);
    
    res.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    res.status(500).json({ message: 'Error fetching frameworks', error: error.message });
  }
});

// @route   GET /api/frameworks/:id
// @desc    Get a specific skill framework
// @access  Public
router.get('/:id', async (req, res) => {
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

// @route   GET /api/frameworks/domain/:domain
// @desc    Get frameworks by domain
// @access  Public
router.get('/domain/:domain', async (req, res) => {
  try {
    const frameworks = await SkillFramework.find({
      domain: req.params.domain.toLowerCase(),
    })
      .select('roleName domain totalSkills')
      .sort({ roleName: 1 });
    
    res.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks by domain:', error);
    res.status(500).json({ message: 'Error fetching frameworks', error: error.message });
  }
});

module.exports = router;
