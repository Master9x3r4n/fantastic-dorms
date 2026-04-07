// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import fs from 'fs';
import Listing from '../models/Listing.js'; 
import Review from '../models/Review.js'; 

class ListingController {
	async findAll(req, res) {
		let condition = {};
		if (req.query.name) condition['name'] = { $regex: new RegExp(req.query.name), $options: "i" };
		if (req.query.description) condition['description'] = { $regex: new RegExp(description), $options: "i" };
		
		Listing.find(condition)
			.then(data => {
				res.send(data);
			})
			.catch(error => {
				res.status(500).send({
					message: error.message || 'An error occurred.'
				});
			});
	}

	async find(req, res) {
		const listingId = req.params.id;
		Listing.findOne({ listingId: listingId })
			.then(data => {
				if (data)
					res.status(200).send(data);
				else
					res.status(404).send({ message: `Listing with ID ${listingId} could not be found.` });
			})
			.catch(err => {
				res.status(500).send({ 
					message: err.message || 'An error occurred.'
				});
			});
	};

	// Creates a new Listing object
	async create(req, res) {
		// Create a Listing
		const listing = new Listing(JSON.parse(req.body.content));

		// Save Listing in the database
		listing.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			console.error('An error occurred while creating new Listing: ' + err.message);
			res.status(500).send({
				message: err.message || "An error occurred."
			});
		});
	};

	// Updates Listing object with ID
	async update(req, res) {
		const id = req.params.id;
		const listing = JSON.parse(req.body.content);
		const rawMedia = req.files;
		const uploadedMedia = [];		

		//validate if user is admin or user is listing owner
		if (listing.owner !== req.session.user.username && !req.session.user.isAdmin)
			return res.status(403).json({ message: 'Forbidden' });

		try {
			// Removing all 'deleted' images
			if (listing.deletedMedia.length > 0) {
				for (const media of listing.deletedMedia) {
					const publicId = extractPublicId(media);
					const response = await cloudinary.uploader.destroy(publicId, {
						resource_type: 'image',
						invalidate: true
					});

					if (response.result !== 'ok') {
						console.log(`Warning: Attempted to delete file with ID ${publicId}, but received result of '${response.result}'.`);
					}
				}
			}
			
			// Uploading the new images
			let count = 0;
			for (const media of rawMedia) {
				const json = await cloudinary.uploader.upload(media.path, {
					resource_type: 'image',
					public_id: `${id}-${count}`,
					folder: 'listingMedia',
					invalidate: true,
				});

				// uploadedMedia.push(`https://res.cloudinary.com/fantasticdorms/image/upload/${json.public_id}`);
				uploadedMedia.push(json.secure_url);
				if (fs.existsSync(media.path)) {
					fs.unlinkSync(media.path);
				}

				count++;
			}
			listing.media.push(...uploadedMedia);
			
			const response = await Listing.findOneAndUpdate({ listingId: id }, listing, {
				useFindAndModify: false
			});

			if (!response) {
				res.status(404).send({
					message: `Listing with ID \'${id}\' could not be found.`
				});
			} else {
				res.send({
					message: `Listing with ID \'${id}\' was updated successfully.`
				});
			}
		} catch (err) {
			console.error(`An error occurred while updating Listing with ID \'${id}\': ${err.message}`);
			res.status(500).send({
				message: err.message || `An error occurred while updating Listing with ID \'${id}\.'`
			});
		}
	}

	// Delete a Listings with the specified listingId in the request
	async delete(req, res) {
		const user = req.session.user;
		const listingId = req.params.id;

		if (!user.isAdmin) {
			return res.status(401).send({
				message: 'Unauthorized. Carlos! Shoo'
			});
		}

		try {
			const listing = await Listing.findOne({ listingId: listingId });
			if (listing) {
				// Delete files
				if (listing.media && listing.media.length > 0) {
					for (const media of listing.media) {
						const publicId = extractPublicId(media);
						const response = await cloudinary.uploader.destroy(publicId, {
							resource_type: 'image',
							invalidate: true
						});

						if (response.result !== 'ok') {
							console.log(`Warning: Attempted to delete file with ID ${publicId}, but received result of '${response.result}'.`);
						}
					}
				}
				
				const deletedListing = await Listing.deleteOne({ listingId: listingId });
				res.status(204).send(deletedListing);
			} else {
				res.status(404).send({ message: 'Listing with ID ' + listingId + ' could not be found.' });
			}
		} catch (err) {
			console.error('An error occurred while deleting Listing with ID ' + listingId + ': ' + err.message);
			res.status(500).send({ message: err.message });
		}
	}
}

export default new ListingController();