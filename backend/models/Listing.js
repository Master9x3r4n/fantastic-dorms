const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    //Unique identifier
    listingId: { type: Number, required: true }, 

    //Listing information
    name: { type: String },
    address: { type: String },
    description: { type: String },
    owner: { type: String },
    amenities: [String],
    contacts: [
        {
        name: { type: String }, //name of contact (i.e. facebook)
        link: { type: String }, //link to contact (i.e. facebook link)
        }
    ],
    mediaSrcs: [String],
    locationSrc: { type: String },
    rating: [
        {
        name: { type: String },
        rating: { type: Number },
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);