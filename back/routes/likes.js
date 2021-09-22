var express = require('express');
var router = express.Router();
var likesController = require('../controllers/likesController');

router.get('/likes', likesController.getAll);
router.post('/like', likesController.post);
router.post('/unlike', likesController.delete);

module.exports = router;
