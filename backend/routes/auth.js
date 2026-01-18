const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ActivityLog = require('../models/ActivityLog');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Log activity
const logActivity = async (userId, action, req) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('domainInterest')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Domain interest cannot be empty if provided'),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, domainInterest, role } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        domainInterest: domainInterest || null,
        role: role === 'admin' ? 'admin' : 'student', // Default to student
      });

      // Create student profile if role is student
      if (user.role === 'student') {
        await StudentProfile.create({
          userId: user._id,
          skills: [],
          projects: [],
        });
      }

      // Log activity
      await logActivity(user._id, 'register', req);

      // Return user data and token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        domainInterest: user.domainInterest,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check for admin credentials first
      if (email === 'admin@gmail.com' && password === 'admin12345') {
        // Check if admin user exists, if not create one
        let adminUser = await User.findOne({ email: 'admin@gmail.com' });
        
        if (!adminUser) {
          adminUser = await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin12345',
            role: 'admin',
          });
        } else if (adminUser.role !== 'admin') {
          // Update role if user exists but is not admin
          adminUser.role = 'admin';
          await adminUser.save();
        }

        // Log activity
        await logActivity(adminUser._id, 'login', req);

        return res.json({
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          domainInterest: adminUser.domainInterest,
          token: generateToken(adminUser._id),
        });
      }

      // Check for user (include password for comparison)
      const user = await User.findOne({ email }).select('+password');

      if (user && (await user.matchPassword(password))) {
        // Log activity
        await logActivity(user._id, 'login', req);

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          domainInterest: user.domainInterest,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
