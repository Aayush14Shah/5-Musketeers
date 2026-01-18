const mongoose = require('mongoose');

const JobTrendSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "React", "Data Analyst"
        required: true,
        unique: true // One document per skill/role to track history
    },
    type: {
        type: String,
        enum: ['skill', 'role'],
        required: true
    },
    currentCount: {
        type: Number,
        default: 0
    },
    previousCount: {
        type: Number,
        default: 0
    },
    trendScore: {
        type: Number, // Percentage growth, e.g., 0.5 for 50%
        default: 0
    },
    trendType: {
        type: String,
        enum: ['Fast Rising', 'Rising', 'Stable', 'Declining', 'New & Emerging'],
        default: 'New & Emerging'
    },
    history: [{
        date: {
            type: Date,
            default: Date.now
        },
        count: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    // Enhanced Metadata
    locations: [{ type: String }], // e.g. ["New York", "Remote", "London"]
    platforms: [{ type: String }], // e.g. ["LinkedIn", "Indeed", "Glassdoor"]
    recentJob: { // Store one real job for verification display
        title: String,
        company: String,
        link: String,
        via: String
    }
});

// Calculate trend score and type before saving
JobTrendSchema.pre('save', function () {
    if (this.previousCount > 0) {
        this.trendScore = (this.currentCount - this.previousCount) / this.previousCount;
    } else if (this.currentCount > 0) {
        this.trendScore = 1; // 100% growth if generic new
    } else {
        this.trendScore = 0;
    }

    // Classify trend
    const percentage = this.trendScore * 100;
    if (this.previousCount === 0 && this.currentCount > 0) {
        this.trendType = 'New & Emerging';
    } else if (percentage > 20) {
        this.trendType = 'Fast Rising';
    } else if (percentage >= 5) {
        this.trendType = 'Rising';
    } else if (percentage >= -5) {
        this.trendType = 'Stable';
    } else {
        this.trendType = 'Declining';
    }

    // Add to history if it's a new day or update last entry (simplified for hackathon: always push new for now, or just limit array)
    // For simplicity, we just keep the last 30 entries
    if (this.history.length > 30) {
        this.history.shift();
    }

    this.lastUpdated = Date.now();
});

module.exports = mongoose.model('JobTrend', JobTrendSchema);
