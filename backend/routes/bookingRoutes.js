const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, bookingController.createBooking, async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.validate();
    const savedBooking = await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});
router.get('/user', ensureAuthenticated, bookingController.getBookingsForUser);
router.get('/provider', ensureAuthenticated, bookingController.getBookingsForServiceProvider);
router.put('/status', ensureAuthenticated, bookingController.updateBookingStatus);

module.exports = router;