var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController');

router.post('/isvalidusername', usersController.isValidUsername);
router.post('/isvalidphone', usersController.isValidPhone);

router.get('/users', usersController.getAll);
router.get('/users/:id', usersController.get);
router.put('/users/:id', usersController.put);
router.delete('/users/:id', usersController.delete);

module.exports = router;