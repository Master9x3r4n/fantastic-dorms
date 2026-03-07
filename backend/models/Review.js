const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    //Not exactly sure how review IDs are linked but they will all contain their listing ID they belong to.
    listingId: { type: Number }, 
    
    username: { type: String },
    content: {
        title: { type: String },
        description: { type: String }, //the actual review
        reply: { type: String }, //owner reply
    },
    
    rating: { type: Number }, //rating of review
    score: { type: Number }, //score receive by review
    mediaSrcs: [String],     
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);