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
		type: {
			cleanliness: { type: Number, default: 0 },
			comfort: { type: Number, default: 0 },
			communication: { type: Number, default: 0 },
			location: { type: Number, default: 0 }
		},
		_id: false // <-- Add this to prevent Mongoose from injecting the ObjectId
	},
	score: { type: Number, default: 0 },
	media: [String],
	tags: [String],
	createdAt: { type: Date, default: Date.now },
	votes: {
		upvotes: [String],
		downvotes: [String],
	},
});

const model = mongoose.model('Review', ReviewSchema, 'reviews');
export default model;