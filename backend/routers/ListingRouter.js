// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import express from 'express';
import multer from 'multer'
import ListingController from '../controllers/ListingController.js';
const router = express.Router();
const upload = multer({
	dest: 'buffer/', 
	limits: { fieldSize: 10 * 1024 * 1024 }
});

router.get("/", ListingController.findAll);
router.get("/:id", ListingController.find);
router.post("/", upload.array('newMedia', 5), ListingController.create);
router.patch("/:id", upload.any(), ListingController.update);
router.delete("/:id", ListingController.delete);

export default router;