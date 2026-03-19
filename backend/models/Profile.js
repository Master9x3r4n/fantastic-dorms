const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    // Username will be the PRIMARY KEY ID
    username: { type: String, required: true }, 
    name: { type: String },
    joinDate: { type: String }, // Change this to Date?
    bio: { type: String },
    listingAdmin: { type: String },
    profileImgSrc: { type: String },
    schoolData: {
        name: { type: String },
        since: { type: String }
    },
    dormData: {
        name: { type: String },
        since: { type: String }
    },
    reviewData: {
        since: { type: String }, //Also a date?
        //Array of Review Objects (theres a chance this is redundant and will just fetch data from the reviews itself)
        reviews: [
        {
            listing: 
            {
            id: { type: Number }, //Listing id
            thumbnailSrc: { type: String },
            },
            content: 
            {
            title: { type: String },
            description: { type: String },
            },
            rating: { type: Number }
        }
        ]
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);