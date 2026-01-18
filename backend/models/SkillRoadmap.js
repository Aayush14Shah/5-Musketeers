const mongoose = require('mongoose');

const skillRoadmapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    priority: {
        type: String,
        enum: ['core', 'supporting'],
        default: 'core'
    },
    topics: [{
        type: String
    }],
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['video', 'article', 'course', 'documentation'],
            default: 'article'
        }
    }],
    practiceTask: {
        title: String,
        description: String
    }
}, {
    timestamps: true
});

// Index for fast lookups
skillRoadmapSchema.index({ skill: 1 });

module.exports = mongoose.model('SkillRoadmap', skillRoadmapSchema);
