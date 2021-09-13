var express = require('express');
var router = express.Router();
var requestsController = require('../controllers/requestsController');

router.get('/', requestsController.getAll);
router.get('/:id', requestsController.get);
router.post('/', requestsController.post);
router.put('/:id', requestsController.put);
router.delete('/:id', requestsController.delete);

module.exports = router;
