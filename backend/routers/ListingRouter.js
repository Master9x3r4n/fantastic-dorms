// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

module.exports = app => {
    const listings = require("../controllers/ListingController.js");

    var router = require("express").Router();

    router.post("/", listings.create);

    router.get("/", listings.findAll);

    router.get("/published", listings.findAllPublished);

    router.get("/:id", listings.findOne);

    router.put("/:id", listings.update);

    router.delete("/:id", listings.delete);

    app.use('/api/tutorials', router);
};