// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Profile from '../models/Profile.js';
import PasswordsUtils from '../passwords.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
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
				// const salt = PasswordsUtils.generateSalt();
				// const digest = PasswordsUtils.generateDigest(password + salt);
				const salted = await PasswordsUtils.generateDigest(password);
				const profile = new Profile({
					username: username,
					// salt: salt,
					saltedPassword: salted
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
		const oldUsername = req.params.username;
		const updates = JSON.parse(req.body.content);
		const rawMedia = req.files;
		let uploadedMedia = null;

		// console.log('=====================');
		// console.log(updates);
		// console.log(req.files);
		// console.log(rawMedia);
		// console.log('=====================');

		try {
			const profile = await Profile.findOne({ username: oldUsername });
			if (profile) {
				// Delete old profile picture
				if (updates.deletedMedia) {
					const publicId = extractPublicId(updates.deletedMedia);
					const response = await cloudinary.uploader.destroy(publicId, {
						resource_type: 'image',
						invalidate: true
					});

					if (response.result !== 'ok') {
						console.log(`Warning: Attempted to delete file with ID ${publicId}, but received result of '${response.result}'.`);
					}
				}

				// Update profile picture, if there are changes
				if (rawMedia[0]) {
					const json = await cloudinary.uploader.upload(rawMedia[0].path, {
						resource_type: 'image',
						public_id: `${updates.username}`,
						folder: 'profileMedia',
						invalidate: true,
					});
	
					// uploadedMedia = `https://res.cloudinary.com/fantasticdorms/image/upload/${json.public_id}`;
					uploadedMedia = json.secure_url;
					if (fs.existsSync(rawMedia[0].path)) {
						fs.unlinkSync(rawMedia[0].path);
					}
					updates.picture = uploadedMedia;
				}

				if (updates.username !== oldUsername) {
					const newProfile = await Profile.findOne({ username: updates.username })
					if (newProfile) {
						return res.status(409).send({ message: `Profile \'${updates.username}\' already exists.` });
					}
				}
				
				const newProfile = await Profile.findOneAndUpdate(
					{ username: updates.username }, 
					updates, 
					{ 
						// give us the updated values from mongodb
						returnDocument: 'after',
						runValidators: true,
					} 
				);
				res.status(200).send(newProfile);
			} else {
				res.status(404).send({
					message: `Profile ${updates.username} could not be found.`
				});
			}
		} catch (err) {
			console.log(`An error occurred while updating Profile ${oldUsername}: ${err.message}`);
			res.status(500).send({
				message: err.message || `An error occurred while updating Profile ${oldUsername}.`
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
						isAdmin: profile.isAdmin
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