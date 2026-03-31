// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

import express from 'express';
import ReviewController from '../controllers/ReviewController.js';
const router = express.Router();

router.get('/', ReviewController.findAll);
router.get('/:id', ReviewController.find);
router.post('/', ReviewController.create);
router.patch('/', ReviewController.update);
router.delete('/:id', ReviewController.delete);

export default router;