// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import Review from '../models/Review.js';
// const MAX_MEDIA_COUNT = 10;

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
				res.status(200).send(reviews)
			} else {
				res.status(404).send({
					message: `Reviews could not be found. Condition/s: ${condition}`
				})
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while finding Reviews.`
			});
		}
	}

	// Finds Review document with ID
	// Returns: One Review document
	async find(req, res) {
		const id = req.params.id;

		try {
			const review = await Review.findById(id);
			if (review) {
				res.status(200).send(review);
			} else {
				res.status(404).send({
					message: `Review with ID ${id} could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while finding Review ${id}.`
			});
		}
	}

	// Creates Review document
	// Returns: Review document that was created
	async create(req, res) {
		const review = new Review(JSON.parse(req.body.content));
		const rawMedia = req.files;
		const uploadedMedia = [];
		
		// I'm fucking tired, boss
		try {
			let count = 0;
			for (const media of rawMedia) {
				const json = await cloudinary.uploader.upload(media.path, {
					resource_type: 'image',
					public_id: `${review._id}-${count}`,
					folder: 'reviewMedia',
					invalidate: true,
				})

				// Rebuild with this URL:
				// https://res.cloudinary.com/fantasticdorms/image/upload/reviewMedia/<public_id>.png
				// uploadedMedia.push(`https://res.cloudinary.com/fantasticdorms/image/upload/${json.public_id}`);
				uploadedMedia.push(json.secure_url);
				if (fs.existsSync(media.path)) {
					fs.unlinkSync(media.path);
				}

				count++;
			}

			// console.log('Uploaded media:');
			// console.log(uploadedMedia);

			review.media = uploadedMedia;
			const response = await new Review(review).save();
			res.status(201).send(response);
		} catch (err) {
			console.log('Error occurred while creating Review: ' + err.message);
			res.status(500).send({
				message: err.message || `An error occurred while creating Review.`
			});
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

			res.status(200).send(updatedReview);
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while updating Review ${id}.`
			});
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
				for (const publicId in review.media) {
					const response = await cloudinary.uploader.destroy(publicId, {
						resource_type: 'image'
					});

					if (response.result !== 'ok') {
						console.log(`Warning: Attempted to delete file with ID ${publicId}, but received result of '${response.result}'.`);
					}
				}

				const result = await Review.deleteOne(id);
				res.status(204).send(result);
			} else {
				res.status(404).send({
					message: `Review with ID ${id} could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while deleting Review ${id}.`
			});
		}
	}

	// updates the score by receiving the direction
	async updateScore(req, res) {
		const id = req.params.id;
		const direction = req.body.direction;
		const userId = req.body.userId;

		try {
			const review = await Review.findById(id);
			if (!review) return res.status(404).send({ message: "Review not found" });

			let upvotes = [...review.votes.upvotes];
			let downvotes = [...review.votes.downvotes];

			if (direction === 'up') {
				// Remove from downvotes AND add to upvotes
				downvotes = downvotes.filter(u => u !== userId);
				if (!upvotes.includes(userId)) upvotes.push(userId);
			}
			else if (direction === 'down') {
				// Remove from upvotes AND add to downvotes
				upvotes = upvotes.filter(u => u !== userId);
				if (!downvotes.includes(userId)) downvotes.push(userId);
			}
			else if (direction === 'removeup') {
				upvotes = upvotes.filter(u => u !== userId);
			}
			else if (direction === 'removedown') {
				downvotes = downvotes.filter(u => u !== userId);
			}

			const score = upvotes.length - downvotes.length;

			const updatedReview = await Review.findByIdAndUpdate(
				id,
				{
					$set: {
						'votes.upvotes': upvotes,
						'votes.downvotes': downvotes,
						score: score
					}
				},
				{ returnDocument: 'after', runValidators: true }
			);

			if (!updatedReview) return res.status(404).send({ message: "Review not found" });

			res.status(200).send(updatedReview);
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	}
}

export default new ReviewController();