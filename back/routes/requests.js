var express = require('express');
var router = express.Router();
var requestsController = require('../controllers/requestsController');

router.get('/requests', requestsController.getAll);
router.get('/requests/:id', requestsController.get);
router.post('/requests', requestsController.post);
router.put('/requests/:id', requestsController.put);
router.delete('/requests/:id', requestsController.delete);

router.post('/getBySender/:_Sender', requestsController.getBySender);
router.post('/getByReceiver/:_Receiver', requestsController.getByReceiver);

module.exports = router;
