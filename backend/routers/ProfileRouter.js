/*
    ProfileRouter

    Acts as the means of routing HTTP requests.
    Interfaces with the ProfileController.
    Please don't ask me how this works. I don't know. -M
*/

// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
const router = express.Router();

router.get('/', ProfileController.findAll);
router.get('/:username', ProfileController.find);
router.post('/', ProfileController.create);

export default router;