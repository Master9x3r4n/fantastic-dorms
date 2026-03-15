const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    
    name: {
        firstName: { type: String },
        lastName: { type: String }
    },
    saltedPassword: { type: String },
    joinDate: { type: Date, default: Date.now },
    picture: { type: String },
    bio: { type: String },
    school: {
        name: { type: String },
        since: { type: String }
    },
    dorm: {
        name: { type: String },
        since: { type: String }
    },
    listingAdmin: { type: String }
});

module.exports = mongoose.model('Profile', ProfileSchema);