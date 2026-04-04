// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Listing from '../models/Listing.js'; 

class ListingController {
	// Create and Save a new Listings
	async create(req, res) {
		// Validate request
		if (!req.body.owner) {
			res.status(400).send({ message: "Owner has to exist!" });
			return;
		}

		// Create a Listings
		const listing = new Listing({
			listingId: req.body.listingId,
			owner: req.body.owner
		});

		// Save Listings in the database
		listing
			.save()
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

	// Update a Listings by the listingId in the request
	async update(req, res) {
		if (!req.body) {
			return res.status(400).send({
			message: "Data to update can not be empty!"
			});
		}

		const listingId = req.params.listingId;
		const fieldName = req.params.fieldName;
		const newVal = req.params.newVal;

		Listing.findAndUpdate( {listingId: listingId}, { fieldName: newVal}, { useFindAndModify: false })
			.then(data => {
			if (!data) {
				res.status(404).send({
				message: `Cannot update Listings with listingId=${listingId}. Maybe Listings was not found!`
				});
			} else res.send({ message: "Listings was updated successfully." });
			})
			.catch(err => {
			res.status(500).send({
				message: "Error updating Listings with listingid=" + listingId
			});
		});
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

	// Delete all Listings from the database.
	async deleteAll(req, res) {
		Listing.deleteMany({})
			.then(data => {
				res.send({
					message: `${data.deletedCount} Listings were deleted successfully!`
				});
			})
			.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while removing all Listings."
				});
			});
	};

	// Update fields nested in Listing
	async updateNested(req, res) {
		const listingId = req.body.listingId;

		// find listing in question 
		const listing = Listing.findOne( {listingId: listingId} );

		const path = req.body.path;
		const newVal = req.body.newVal;

		// update nested field
		listing.set(path, newVal);

		// save it to database
		listing
		.save()
		.then(data => 
					{
					res.send(data);
					})
					.catch(err => {
					res.status(500).send({
						message:
						err.message || "Some error occurred while updating the Listing."
					});
				});
	}

	// Find all published Listings
	async findAllPublished(req, res) {
	
	};
}

export default new ListingController();