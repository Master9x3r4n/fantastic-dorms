const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    name: {
        firstName: { type: String, default: 'Firstname' },
        lastName: { type: String, default: 'McLastname' }
    },
    salt: { type: String },
    saltedPassword: { type: String },
    joinDate: { type: Date, default: Date.now },
    picture: { type: String, default: '' },
    bio: { type: String, default: 'Goodbye cruel world' },
    school: {
        name: { type: String, default: '' },
        since: { type: String, default: '' }
    },
    dorm: {
        name: { type: String, default: '' },
        since: { type: String, default: '' }
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);