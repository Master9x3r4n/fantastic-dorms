const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Listing', ListingSchema);