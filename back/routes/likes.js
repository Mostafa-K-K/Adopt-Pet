var express = require('express');
var router = express.Router();
var likesController = require('../controllers/likesController');

router.get('/', likesController.getAll);
router.post('/', likesController.post);
router.delete('/:id', likesController.delete);

module.exports = router;
