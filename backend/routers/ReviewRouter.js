// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

import express from 'express';
import multer from 'multer';
import ReviewController from '../controllers/ReviewController.js';
const router = express.Router();
const upload = multer({ dest: 'buffer/' });

router.get('/', ReviewController.findAll);
router.get('/:id', ReviewController.find);
router.post('/', upload.array('media', 4), ReviewController.create);
router.patch('/:id', ReviewController.update);
router.delete('/:id', ReviewController.delete);

export default router;