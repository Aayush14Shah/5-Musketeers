const mongoose = require('mongoose');

const skillFrameworkSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        importance: {
          type: Number,
          required: true,
          enum: [2, 3, 5], // 2 = easy, 3 = medium, 5 = hard
        },
        category: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          required: true,
        },
      },
    ],
    totalSkills: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: 'csv_upload',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
skillFrameworkSchema.index({ roleName: 1, domain: 1 }, { unique: true });

// Update totalSkills before saving
skillFrameworkSchema.pre('save', function () {
  this.totalSkills = this.skills.length;
});

module.exports = mongoose.model('SkillFramework', skillFrameworkSchema);
