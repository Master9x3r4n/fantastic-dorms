/*
    ProfileRouter

    Acts as the means of routing HTTP requests.
    Interfaces with the ProfileController.
    Please don't ask me how this works. I don't know. -M
*/

// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

const router = require('express').Router();
let controller = require('../controllers/ProfileController.js');

router.get('/', controller.findAll);
router.get('/:username', controller.find);
router.post('/', controller.create);

module.exports = router;