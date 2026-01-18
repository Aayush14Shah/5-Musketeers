const express = require('express');
const router = express.Router();
const {
    refreshTrends,
    getEmergingTrends,
    getSkillTrends,
    getRoleTrends
} = require('../controllers/trendController');

// @route   POST /api/trends/refresh
// @desc    Trigger analysis logic
router.post('/refresh', refreshTrends);

// @route   GET /api/trends/emerging
// @desc    Get fast-rising trends
router.get('/emerging', getEmergingTrends);

// @route   GET /api/trends/skills
// @desc    Get all skill trends
router.get('/skills', getSkillTrends);

// @route   GET /api/trends/roles
// @desc    Get all role trends
router.get('/roles', getRoleTrends);

module.exports = router;
