const Profile = require('./Profile'); 
const { generateDigest, generateSalt } = require('../passwords');


/*
    NOTE TO MIRO:
        WHEN MAKING THE BODY OF THE REQUEST USED FOR THIS FUNCTION
        INCLUDE 2 FIELDS, THE USERNAME USER INPUT AND PASSWORD INPUT
*/
// Create and Save a new Profile
exports.create = (req, res) => {

    const username = req.body.username;
    const pwInput = req.body.pwInput;

    // Validate request
    if (!username) {
        res.status(400).send({ message: "Username can not be empty!" });
        return;
    }

    
    const exists = Profile.findOne( {username: username} );

        //checking if username valid
        if (exists)
        {
            console.log('Username taken!');
        }
        else
        {
            console.log('Username available!');
            salt = generateSalt();

            // Create a Profile
            const profile = new Profile({
                username: username,
                salt: salt,
                saltedPassword: generateDigest(pwInput + salt)
            })

            // Save Profile in the database
            profile
            .save()
            .then(data => 
                {
                res.send(data);
                })
                .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the Profile."
                });
            });
        }
    
};

// Retrieve all Profiles from the database.
exports.findAll = (req, res) => {
    const tempUsername = req.query.username;
    var condition = tempUsername ? { username: { $regex: new RegExp(tempUsername), $options: "i" } } : {};

    Profile.find(condition)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving profiles."
        });
        });
};

// Find a single Profile with a specific username
exports.findOne = (req, res) => {
    const username = req.params.username;

    Profile.findOne( {username: username} )
        .then(data => {
        if (!data)
            res.status(404).send({ message: "Not found Profile with username:" + username });
        else res.send(data);
        })
        .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving Profile with username=" + username });
        });
};

// Update a Profile by the username in the request
exports.update = (req, res) => {
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
exports.delete = (req, res) => {
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
exports.deleteAll = (req, res) => {
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
exports.updateNested = (req, res) =>{

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
}

// Find all published Profile
exports.findAllBySomethingLater = (req, res) => {
  
};
