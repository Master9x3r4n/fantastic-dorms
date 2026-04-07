// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

import express from 'express';
import multer from 'multer';
import ReviewController from '../controllers/ReviewController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();
const upload = multer({
	dest: 'buffer/',
	limits: { fieldSize: 10 * 1024 * 1024 }
});

router.get('/', ReviewController.findAll);
router.get('/:id', ReviewController.find);
router.post('/', upload.array('media', 10), ReviewController.create);
router.patch('/:id', requireAuth, ReviewController.update);
router.delete('/:id', requireAuth, ReviewController.delete);
router.patch('/:id/vote', requireAuth, ReviewController.updateScore);

export default router;