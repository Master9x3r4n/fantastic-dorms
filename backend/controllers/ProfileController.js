// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Profile from '../models/Profile.js';
import PasswordsUtils from '../passwords.js';

class ProfileController {
    // Retrieves all profiles from the database
    findAll(req, res) {
        Profile.find({})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'An error occurred while attempting to retrieve all profiles.'
                });
            });
    };

    // Retrieve a single Profile with a specific username
    // Usernames act as a primary ID and cannot be repeated
    find(req, res) {
        const username = req.params.username;
        
        Profile.findOne({ username: username })
            .then(data => {
                if (!data)
                    res.status(404).send({ message: `Profile \'${username}\' could not be found.` });
                else
                    res.send(data);
            })
            .catch(err => {
                res.status(500).send({ message: `An error occurred while retrieving profile \'${username}\'.` });
            });
    };

    // Create and save a new Profile
    create(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        // Check if a Profile with the username exists already
        Profile.findOne({ username: username })
            .then(data => {
                if (data)
                    res.status(409).send({ message: `Profile ${username} already exists.` });
                else {
                    // Create a Profile
                    const salt = PasswordsUtils.generateSalt();
                    const digest = PasswordsUtils.generateDigest(password + salt);
                    const profile = new Profile({
                        username: username,
                        salt: salt,
                        saltedPassword: digest
                    })

                    // Save Profile in the database
                    profile.save()
                        .then(data => 
                            {
                                res.send(data);
                            })
                        .catch(err => {
                            res.status(500).send({
                                message: `An error occurred while creating Profile ${username}.`
                            });
                        });
                }
            })
    };
        
    // Update a Profile by the username in the request
    update(req, res) {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }
        
        const username = req.params.username;
        const fieldName = req.params.fieldName;
        const newVal = req.params.newVal;

        Profile.findAndUpdate( {username: username} , {fieldName: newVal}, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                    message: `Cannot update Profile with username=${username}. Maybe Profile was not found!`
                    });
                } else res.send({ message: "Profile was updated successfully." });
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating Profile with username=" + username
                });
            });
    };

    // Delete a Profile with the specified username in the request
    delete(req, res) {
        const username = req.params.username;

        Profile.findOneAndDelete( {username: username} )
            .then(data => {
                if (!data) {
                    res.status(404).send({
                    message: `Cannot delete Profile with username=${username}. Maybe Profile was not found!`
                    });
                } else {
                    res.send({
                    message: "Username was deleted successfully!"
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Could not delete Profile with username=" + username
                });
            });
    };

    // Delete all Profile from the database.
    deleteAll(req, res) {
        Profile.deleteMany({})
            .then(data => {
                res.send({
                    message: `${data.deletedCount} Profiles were deleted successfully!`
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while removing all profiles."
                });
            });
    };

    // Update fields nested in Profile
    updateNested(req, res) {
        const username = req.body.username;

        // find profile in question 
        const profile = Profile.findOne( {username: username} );

        const path = req.body.path;
        const newVal = req.body.newVal;

        // update nested field
        profile.set(path, newVal);

        // save it to database
        profile
            .save()
            .then(data => 
                {
                res.send(data);
                })
                .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while updating the Profile."
                });
            });
    };

    // Find all published Profile
    findAllBySomethingLater(req, res) {
        
    };

    login(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        Profile.findOne({ username: username })
            .then(data => {
                const salt = data.salt
                const hash = data.saltedPassword
                const newHash = PasswordsUtils.generateDigest(password + salt);

                if (hash === newHash) {
                    res.status(200).send({ message: 'OK' });
                } else {
                    res.status(401).send({ message: 'Unauthorized' });
                }
            })
            .catch(error => {
                res.status(500).send({ message: error })
            })
    };
}

export default new ProfileController();