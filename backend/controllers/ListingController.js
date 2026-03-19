// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Listing from './Listing'; 

class ListingController {
    // Create and Save a new Listings
    create(req, res) {
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
                err.message || "Some error occurred while creating the Listings."
            });
            });
    };

    findAll(req, res) {
        Listing.find({})
            .then(data => {
                res.send(data);
            })
            .catch(error => {
                res.status(500).send({
                    message: error.message || 'An error occurred while retrieving all listings.'
                });
            });
    }

    // Retrieve all Listings from the database.
    findAllUsingName(req, res) {
        const name = req.query.name;
        var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

        Listing.find(condition)
            .then(data => {
            res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving Listings."
            });
            });
    };

    // Retrieve all Listings from the database.
    findAllUsingDescription(req, res) {
        const description = req.query.description;
        var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};

        Listing.find(condition)
            .then(data => {
            res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving Listings."
            });
            });
    };

    // Find a single Listing with a listingId
    findOne(req, res) {
        const listingId = req.params.listingId;

        Listing.findOne( {listingId: listingId} )
            .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Listings with listingId " + listingId });
            else res.send(data);
            })
            .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Listings with listingId=" + listingId });
            });
    };

    // Update a Listings by the listingId in the request
    update(req, res) {
        if (!req.body) {
            return res.status(400).send({
            message: "Data to update can not be empty!"
            });
        }

        const listingId = req.params.listingId;
        const fieldName = req.params.fieldName;
        const newVal = req.params.newVal;

        Listing.findAndUpdate( {listingId: listingId}, { fieldName: newval}, { useFindAndModify: false })
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
    delete(req, res) {
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
    deleteAll(req, res) {
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
    updateNested(req, res) {
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
    findAllPublished(req, res) {
    
    };
}

export default new ListingController();