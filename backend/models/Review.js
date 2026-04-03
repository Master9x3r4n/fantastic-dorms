import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
	listingId: { type: String, required: true },
	username: { type: String, required: true },
	isAnonymous: { type: Boolean, default: false },
	content: {
		title: { type: String, default: '' },
		body: { type: String, default: '' },
		reply: { type: String, default: '' }
	},
	rating: {
		cleanliness: { type: Number, default: 0 },
		comfort: { type: Number, default: 0 },
		communication: { type: Number, default: 0 },
		location: { type: Number, default: 0 }
	},
	score: { type: Number, default: 0 },
	media: [String],
	tags: [String],
	createdAt: { type: Date, default: Date.now }
});

const model = mongoose.model('Review', ReviewSchema, 'reviews');
export default model;