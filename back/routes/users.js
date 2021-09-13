var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController');

router.get('/', usersController.getAll);
router.get('/:id', usersController.get);
router.put('/:id', usersController.put);
router.delete('/:id', usersController.delete);

module.exports = router;