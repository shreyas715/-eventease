const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        seats: {
            type: Number,
            required: true,
            min: 1
        },
        registered: {
            type: Number,
            default: 0,
            min: 0
        },
        icon: {
            type: String,
            default: '📚'
        },
        color: {
            type: String,
            default: 'purple'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Workshop', workshopSchema);