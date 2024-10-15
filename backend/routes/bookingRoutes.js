const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, bookingController.createBooking);
router.get('/my-bookings', ensureAuthenticated, bookingController.getBookingsForUser);
router.get('/provider-bookings', ensureAuthenticated, bookingController.getBookingsForServiceProvider);
router.put('/update-status', ensureAuthenticated, bookingController.updateBookingStatus);

module.exports = router;
