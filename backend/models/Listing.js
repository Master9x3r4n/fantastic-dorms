import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
	listingId: { type: String, required: true },
	owner: { type: String, required: true },
	name: { type: String, default: '' },
	address: { type: String, default: '' },
	description: { type: String, default: '' },
	amenities: [String],
	contacts: [
		{
			name: { type: String, default: '' },
			link: { type: String, default: '' }
		}
	],
	media: [String],
	location: { type: String, default: '' },
	rating: {
		type: {
			cleanliness: { type: Number, default: 0 },
			comfort: { type: Number, default: 0 },
			communication: { type: Number, default: 0 },
			location: { type: Number, default: 0 }
		},
		_id: false // <-- Add this to prevent Mongoose from injecting the ObjectId
	},
	createdAt: { type: Date, default: Date.now },
	isVerified: { type: Boolean, default: false }
});

const model = mongoose.model('Listing', ListingSchema, 'listings');
export default model;