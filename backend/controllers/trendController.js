const { updateTrends } = require('../services/trendAnalyzeService');
const JobTrend = require('../models/JobTrend');

/**
 * @desc    Trigger a manual update of trends (Real-time fetch)
 * @route   POST /api/trends/refresh
 * @access  Public (or Admin)
 */
exports.refreshTrends = async (req, res) => {
    try {
        const { domain } = req.body; // Expect frontend to send { "domain": "Frontend Developer" }
        const results = await updateTrends({ domain });
        res.status(200).json({
            message: 'Trends updated successfully',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during trend analysis' });
    }
};

/**
 * @desc    Get Emerging Trends (Fast Rising)
 * @route   GET /api/trends/emerging
 * @access  Public
 */
exports.getEmergingTrends = async (req, res) => {
    try {
        const trends = await JobTrend.find({ trendType: { $in: ['Fast Rising', 'Rising', 'New & Emerging'] } })
            .sort({ trendScore: -1 })
            .limit(10);
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get Skill Trends
 * @route   GET /api/trends/skills
 * @access  Public
 */
exports.getSkillTrends = async (req, res) => {
    try {
        const trends = await JobTrend.find({ type: 'skill' }).sort({ currentCount: -1 });
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get Role Trends
 * @route   GET /api/trends/roles
 * @access  Public
 */
exports.getRoleTrends = async (req, res) => {
    try {
        const trends = await JobTrend.find({ type: 'role' }).sort({ currentCount: -1 });
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
