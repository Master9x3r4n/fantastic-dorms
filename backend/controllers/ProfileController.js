// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Profile from '../models/Profile.js';
import PasswordsUtils from '../passwords.js';
import { v2 as cloudinary } from 'cloudinary';
import { passwordUpdateSchema } from '../passwordValidator.js';

class ProfileController {
	// Retrieves all profiles from the database
	// Returns: Array of Profile documents
	async findAll(req, res) {
		try {
			const profiles = await Profile.find({});
			if (profiles) {
				res.status(200).send(profiles);
			} else {
				res.status(404).send({
					message: 'Profiles could not be found.'
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || 'An error occurred while retrieving Profiles.'
			});
		}
	};

	// Retrieve a single Profile with a specific username
	// Usernames act as a primary ID and cannot be repeated
	// Returns: One Profile document
	async find(req, res) {
		const username = req.params.username;

		try {
			const profile = await Profile.findOne({ username: username });
			if (profile) {
				res.status(200).send(profile);
			} else {
				res.status(404).send({
					message: `Profile \'${username}\' could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while retrieving Profile ${username}.`
			});
		}
	};

	// Create and save a new Profile
	// Returns: Profile document that was created
	async create(req, res) {
		const username = req.body.username;
		const password = req.body.password;

		try {
			const profile = await Profile.findOne({ username: username });
			if (profile) {
				res.status(409).send({
					message: `Profile ${username} already exists.`
				});
			} else {
				const salt = PasswordsUtils.generateSalt();
				const digest = PasswordsUtils.generateDigest(password + salt);
				const profile = new Profile({
					username: username,
					salt: salt,
					saltedPassword: digest
				});

				// console.log('Creating new profile:');
				// console.log(profile);

				const newProfile = await profile.save();
				res.status(201).send(newProfile);
			}
		} catch (err) {
			console.log('ERROR: ' + err.message);
			res.status(500).send({
				message: err.message || `An error occurred while creating Profile ${username}.`
			});
		}
	};

	// Update a Profile by the username in the request
	// Returns: Profile document that was updated
	async update(req, res) {
		const updates = req.body;
		const username = req.params.username;

		try {
			const profile = await Profile.findOne({ username: username });
			if (profile) {
				// Update profile picture, if there are changes

				// ProfileController.js

				const newProfile = await Profile.findOneAndUpdate(
					{ username: username }, 
					updates, 
					{ 
						// give us the updated values from mongodb
						returnDocument: 'after',
						runValidators: true,
					} 
				);

				// if the updated values were returned, send back to frontend
				if (newProfile) 
				{
					res.status(200).send(newProfile);
				} else 
				{
					res.status(404).send({ message: "User not found" });
				}

			} else {
				res.status(404).send({
					message: `Profile ${username} could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while updating Profile ${username}.`
			});
		}
	};

	// Delete a Profile with the specified username in the request
	// Returns: Object { deletedCount: x }
	async delete(req, res) {
		const username = req.params.username;

		try {
			const profile = await Profile.find({ username: username });
			if (profile) {
				// Delete profile picture
				
				const result = await Profile.deleteOne({ username: username });
				res.status(204).send(result)
			} else {
				res.status(404).send({
					message: `Profile ${username} could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while deleting Profile ${username}.`
			});
		}
	};

	// Authenticates given login details
	// Returns: Profile given
	async login(req, res) {
		const username = req.body.username;
		const password = req.body.password;
		const rememberMe = req.body.rememberMe;

		if (typeof username !== 'string' || typeof password !== 'string')
		{
			return res.status(400).send(
			{ 
				message: "oh yes" 
			});
		}

		try {
			const profile = await Profile.findOne({ username: username });
			if (profile) {
				
				const hash = profile.saltedPassword;

				const isMatch = await PasswordsUtils.verifyUser(hash, password);

				if (isMatch) {

					// create user session
					req.session.user = {
						id: profile._id,
						username: profile.username,
					}

					req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour

					if (rememberMe)
						req.session.cookie.maxAge *= 30 * 24; // 1 month (30 days)
					
					res.status(200).send(profile);
				} else {
					res.status(401).send({
						message: 'Unauthorized access.'
					});
				}
			} else {
				res.status(404).send({
					message: `Profile ${username} could not be found.`
				});
			}
		} catch (err) {
			res.status(500).send({
				message: err.message || `An error occurred while logging in with Profile ${username}.`
			});
		}
	};

	// handles updating of passwords in the backend cuz security
	async upadatePassword(req, res)
	{
		const username = req.params.username;
		const result = passwordUpdateSchema.safeParse(req.body);

		if (!result.success) 
		{
			return res.status(400).json({ 
				errors: result.error.flatten().fieldErrors 
			});
		}

		const currentPassword = result.data.currentPassword;
		const newPassword = result.data.newPassword;
		
		// if (typeof username !== 'string' || typeof current !== 'string' || typeof newP !== 'string')
		// if (typeof currentPassword !== 'string' || typeof newPassword !== 'string')
		// {
		// 	return res.status(400).send(
		// 		{ 
		// 			message: "What are YOU trying to do??? o_O" 
		// 		}
		// 	);
		// }

		try
		{
			const dbProfile = await Profile.findOne({ username: username });
			if (dbProfile)
			{
				const dbSaltedHash = dbProfile.saltedPassword;
				const isMatch = await PasswordsUtils.verifyUser(dbSaltedHash, currentPassword)
				// if database info not the same as input for current
				if (!isMatch)
				{
					return res.status(401).send({ 
						message: 'Unauthorized access.'
					});
				}
				else
				{
					dbProfile.saltedPassword = await PasswordsUtils.generateDigest(newPassword);

					await Profile.updateOne(
						{ username: username },
						{ $set: { saltedPassword: dbProfile.saltedPassword } }
					);

					return res.status(200).send({ 
						message: "Password updated successfully." 
					})
				}
			}
			else
			{
				res.status(404).send({
					message: `Profile ${username} could not be found.`
				});
			}
		}
		catch (err)
		{
			res.status(500).send({
				message: err.message || 'An error occurred while retrieving Profiles.'
			});
		}

	};
}

export default new ProfileController();