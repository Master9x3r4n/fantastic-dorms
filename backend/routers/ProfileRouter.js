// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

router.get('/', ProfileController.findAll);
router.get('/:username', ProfileController.find);
router.post('/', ProfileController.create);
router.patch('/:username/password', requireAuth, ProfileController.upadatePassword);
router.patch('/:username', requireAuth, ProfileController.update);
router.delete('/:username', requireAuth, ProfileController.delete);

export default router;