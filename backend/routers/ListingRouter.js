// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import express from 'express';
import multer from 'multer'
import ListingController from '../controllers/ListingController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();
const upload = multer({
	dest: 'buffer/', 
	limits: { fieldSize: 10 * 1024 * 1024 }
});

router.get("/", ListingController.findAll);
router.get("/:id", ListingController.find);
router.post("/", upload.array('newMedia', 5), ListingController.create);
router.patch("/:id", requireAuth, upload.array('newMedia', 5), ListingController.update);
router.delete("/:id", requireAuth, ListingController.delete);

export default router;