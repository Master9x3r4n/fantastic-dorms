const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    listingId: { type: Number, required: true },
    username: { type: String, required: true },
    
    content: {
        title: { type: String },
        description: { type: String },
        reply: { type: String }
    },
    rating: [
        {
            name: { type: String },
            value: { type: Number }
        }
    ],
    score: { type: Number },
    media: [String],     
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);