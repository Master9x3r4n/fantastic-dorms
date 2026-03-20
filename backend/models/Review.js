import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    listingId: { type: String, required: true },
    username: { type: String, required: true },
    
    content: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        reply: { type: String, default: '' }
    },
    rating: [
        {
            name: { type: String, default: '' },
            value: { type: Number, default: 0 }
        },
        {
            name: { type: String, default: '' },
            value: { type: Number, default: 0 }
        },
        {
            name: { type: String, default: '' },
            value: { type: Number, default: 0 }
        },
        {
            name: { type: String, default: '' },
            value: { type: Number, default: 0 }
        }
    ],
    score: { type: Number, default: 0 },
    media: [String],     
    createdAt: { type: Date, default: Date.now }
});

const model = mongoose.model('Review', ReviewSchema, 'reviews');
export default model;