var express = require('express');
var router = express.Router();
var statusController = require('../controllers/statusController');

router.get('/', statusController.getAll);
router.get('/:id', statusController.get);
router.post('/', statusController.post);
router.put('/:id', statusController.put);
router.delete('/:id', statusController.delete);

module.exports = router;
