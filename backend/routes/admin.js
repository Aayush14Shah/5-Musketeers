const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Category = require('../models/Category');
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

// @route   POST /api/admin/upload-csv
// @desc    Upload CSV file and extract categories
// @access  Private/Admin
router.post('/upload-csv', protect, admin, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const filePath = req.file.path;
    const categories = new Set();
    const categoryMap = new Map(); // To store category -> displayName mapping

    // Read and parse CSV file
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Look for 'category' column (case-insensitive)
          const categoryKey = Object.keys(row).find(
            (key) => key.toLowerCase() === 'category' || key.toLowerCase() === 'domain' || key.toLowerCase() === 'sector'
          );

          if (categoryKey && row[categoryKey]) {
            const categoryValue = row[categoryKey].trim();
            if (categoryValue) {
              categories.add(categoryValue.toLowerCase());
              // Store original case for display
              if (!categoryMap.has(categoryValue.toLowerCase())) {
                categoryMap.set(categoryValue.toLowerCase(), categoryValue);
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

            res.json({
              message: 'CSV file processed successfully',
              categoriesCount: savedCategories.length,
              categories: savedCategories.map((cat) => ({
                name: cat.name,
                displayName: cat.displayName,
              })),
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


module.exports = router;
