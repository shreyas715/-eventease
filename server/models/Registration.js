const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        workshop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workshop',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent the same email from registering twice for one workshop.
registrationSchema.index(
    { email: 1, workshop: 1 },
    { unique: true }
);

module.exports = mongoose.model('Registration', registrationSchema);