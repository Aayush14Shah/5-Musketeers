const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    education: {
      institution: String,
      degree: String,
      field: String,
      graduationYear: Number,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        domain: {
          type: String,
          enum: ['healthcare', 'agriculture', 'urban', 'other'],
        },
        technologies: [String],
        link: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    careerGoal: {
      domain: {
        type: String,
        enum: ['healthcare', 'agriculture', 'urban'],
      },
      role: String,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastUpdated on save
studentProfileSchema.pre('save', function () {
  this.lastUpdated = Date.now();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
