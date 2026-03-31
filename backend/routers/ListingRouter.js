// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import express from 'express';
import ListingController from '../controllers/ListingController.js';
const router = express.Router();

router.get("/", ListingController.findAll);
router.get("/:id", ListingController.find);
router.post("/", ListingController.create);
router.patch("/:id", ListingController.update);
router.delete("/:id", ListingController.delete);

export default router;