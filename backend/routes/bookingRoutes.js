const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, bookingController.createBooking);
router.get('/user', ensureAuthenticated, bookingController.getBookingsForUser);
router.get('/provider', ensureAuthenticated, bookingController.getBookingsForServiceProvider);
router.put('/status', ensureAuthenticated, bookingController.updateBookingStatus);

module.exports = router;