var express = require('express');
var router = express.Router();
var adminsController = require('../controllers/adminsController');

router.get('/', adminsController.getAll);

module.exports = router;