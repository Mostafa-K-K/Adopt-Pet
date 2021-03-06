var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

router.post('/signIn', authController.signIn);
router.post('/signUp', authController.signUp);
router.post('/signOut', authController.signOut);
router.post('/initialiseData', authController.initialiseData);

module.exports = router;