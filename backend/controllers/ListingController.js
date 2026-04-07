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
		const listing = new Listing({
			listingId: req.body.listingId,
			owner: req.body.owner
		});

		// Save Listing in the database
		listing.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
				err.message || "An error occurred."
			});
		});
	};

	// Updates Listing object with ID
	async update(req, res) {
		const id = req.params.id;
		const listing = JSON.parse(req.body.content);
		const rawMedia = req.files;
		const uploadedMedia = [];		

		try {
			// Removing all 'deleted' images
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
	};

	// Delete a Listings with the specified listingId in the request
	async delete(req, res) {
		const listingId = req.params.listingId;

		Listing.findOneAndDelete( {listingId: listingId} )
			.then(data => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete Listings with listingId=${listingId}. Maybe Listings was not found!`
				});
			} else {
				res.send({
					message: "Listings was deleted successfully!"
				});
			}
			})
			.catch(err => {
				res.status(500).send({
					message: "Could not delete Listings with listingId=" + listingId
				});
			});
	};
}

export default new ListingController();