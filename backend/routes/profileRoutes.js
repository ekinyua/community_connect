const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, profileController.createProfile);
router.get('/me', ensureAuthenticated, profileController.getProfile);
router.get('/user/:userId', profileController.getProfile);
router.put('/', ensureAuthenticated, profileController.updateProfile);
router.delete('/', ensureAuthenticated, profileController.deleteProfile);
router.get('/', profileController.getAllProfiles);

module.exports = router;