const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, reviewController.createReview);
router.get('/user/:userId', reviewController.getReviews);
router.put('/:reviewId', ensureAuthenticated, reviewController.updateReview);
router.delete('/:reviewId', ensureAuthenticated, reviewController.deleteReview);

module.exports = router;