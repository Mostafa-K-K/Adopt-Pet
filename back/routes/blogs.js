var express = require('express');
var router = express.Router();
var blogsController = require('../controllers/blogsController');

router.get('/', blogsController.getAll);
router.get('/:id', blogsController.get);
router.post('/', blogsController.post);
router.put('/:id', blogsController.put);
router.delete('/:id', blogsController.delete);

module.exports = router;
