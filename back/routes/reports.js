var express = require('express');
var router = express.Router();
var reportsController = require('../controllers/reportsController');

router.get('/reports', reportsController.getAll);
router.post('/reports', reportsController.post);
router.delete('/reports/:id', reportsController.delete);

router.post('/getByReported', reportsController.getByReported);
router.post('/getByReporter', reportsController.getByReporter);

router.post('/getReportsCount', reportsController.getReportsCount);

module.exports = router;