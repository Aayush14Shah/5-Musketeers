const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET /api/categories
// @desc    Get all categories (public for registration)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayName: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

module.exports = router;
