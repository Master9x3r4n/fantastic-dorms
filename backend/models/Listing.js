const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    owner: { type: String, required: true },
    
    name: { type: String },
    address: { type: String },
    description: { type: String },
    amenities: [String],
    contacts: [
        {
            name: { type: String },
            link: { type: String }
        }
    ],
    media: [String],
    location: { type: String },
    rating: [
        {
            name: { type: String },
            value: { type: Number }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);