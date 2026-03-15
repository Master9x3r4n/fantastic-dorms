const Listing = require('./Listing'); 

// Create and Save a new Listings
exports.create = (req, res) => {
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
        .save(listing)
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

// Retrieve all Listings from the database.
exports.findAllUsingName = (req, res) => {
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
exports.findAllUsingDescription = (req, res) => {
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

// Find a single Listings with a listingId
exports.findOne = (req, res) => {
    const listingId = req.params.listingId;

    Listing.find(listingId)
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
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }

    const listingId = req.params.listingId;

    Listing.findAndUpdate(listingid, req.body, { useFindAndModify: false })
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
exports.delete = (req, res) => {
    const listingId = req.params.listingId;

    Listing.findAndRemove(listingId)
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
exports.deleteAll = (req, res) => {
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

// Find all published Listings
exports.findAllPublished = (req, res) => {
  
};