const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, profileController.createOrUpdateProfile);
router.get('/me', ensureAuthenticated, profileController.getCurrentUserProfile);
router.get('/user/:userId', ensureAuthenticated, profileController.getProfile);
router.put('/', ensureAuthenticated, profileController.createOrUpdateProfile);
router.delete('/', ensureAuthenticated, profileController.deleteProfile);
router.get('/search', profileController.searchProfiles);

module.exports = router;