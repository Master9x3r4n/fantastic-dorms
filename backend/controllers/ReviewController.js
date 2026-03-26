// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Review from '../models/Review.js'; 
import { v2 as cloudinary } from 'cloudinary';
const MAX_MEDIA_COUNT = 4;

class ReviewController {
	// Finds all Review documents with query
	// Returns: Array of Review documents
	async findAll(req, res) {
		let condition = {}
		if (req.query.username) condition['username'] = req.query.username;
		if (req.query.listingId) condition['listingId'] = req.query.listingId;
		if (req.query.title) condition['title'] =  { $regex: `/${title}/`, $options: 'i' };

		try {
			const reviews = await Review.find(condition);
			if (reviews) {
				res.status(200).send({ data: reviews, message: 'Reviews found successfully.' })
			} else {
				res.status(404).send({
					message: `Reviews could not be found. Condition/s: ${condition}`
				})
			}
		} catch (err) {
			res.status(500).send({ message: err.message || 'A non-descript error occurred.' });
		}
	}

	// Finds Review document with ID
	// Returns: One Review document
	async find(req, res) {
		const id = req.params.id;

		try {
			const review = await Review.findById(id);
			if (review) {
				res.status(200).send({ 
					data: review,
					message: 'Review found successfully.'
				});
			} else {
				res.status(404).send({
					message: `Review with ID ${id} could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || 'A non-descript error occurred.'
			});
		}
	}

	// Creates Review document
	// Returns: Review document that was created
	async create(req, res) {
		const review = req.body;
		const uploadedMedia = [];
		
		try {
			let count = 0;
			for (const media in req.body.media) {
				if (count >= MAX_MEDIA_COUNT)
					break;

				const json = await cloudinary.uploader.upload(media, {
					resource_type: 'image',
					public_id: `${req.body._id}-${count}`,
					folder: 'reviewMedia'
				})
				uploadedMedia.push(json.public_id);
				count++;
			}

			review.media = uploadedMedia;
			const newReview = await new Review(review).save();
			res.status(201).send({ data: newReview, message: 'Review created successfully.' });
		} catch (err) {
			res.status(500).send({ message: err.message || 'A non-descript error occurred.' });
		}
	};

	// Updates Review document with ID given properties
	// Returns: Review document that was updated
	async update(req, res) {
		const updates = req.body;
		const id = req.params.id;

		try {
			const updatedReview = await Review.findByIdAndUpdate(id, updates, {
				useFindAndModify: false
			});

			res.status(200).send({
				data: updatedReview,
				message: 'Review updated successfully.'
			});
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	}

	// Deletes Review document with ID
	// Returns: Object { deletedCount: x }
	async delete(req, res) {
		const id = req.params.id;

		try {
			const review = await Review.findById(id);
			if (review) {
				// Delete all images on Cloudinary server
				for (publicId in review.media) {
					const response = await cloudinary.uploader.destroy(publicId, {
						resource_type: 'image'
					});

					if (response.result !== 'ok') {
						console.log(`Warning: Attempted to delete file with ID ${publicId}, but received result of '${response.result}'.`);
					}
				}

				const result = await Review.deleteOne(id);
				res.status(204).send({
					data: result, 
					message: `Review with ID ${id} deleted successfully.`
				});
			} else {
				res.status(404).send({ message: `Review with ID ${id} could not be found.` });
			}
		} catch (err) {
			res.status(500).send({ message: err.message || 'A non-descript error occurred.'});
		}
	}
}

export default new ReviewController();