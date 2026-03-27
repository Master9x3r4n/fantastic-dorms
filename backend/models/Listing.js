import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
	listingId: { type: String, required: true },
	ownerUsername: { type: String, required: true },
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
	rating: [
		{
			name: { type: String, default: '' },
			value: { type: Number, default: 0 }
		}
	],
	createdAt: { type: Date, default: Date.now },
	isVerified: { type: Boolean, default: false }
});

const model = mongoose.model('Listing', ListingSchema, 'listings');
export default model;