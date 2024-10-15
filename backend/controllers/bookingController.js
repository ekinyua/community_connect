const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { serviceProviderId, service, date, startTime, endTime, notes } = req.body;

    // Create a new booking
    const booking = await Booking.create({
      consumer: req.user._id,  // The logged-in user is the consumer
      serviceProvider: serviceProviderId,  // The service provider's user ID
      service,
      date,
      startTime,
      endTime,
      notes
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

exports.getBookingsForUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ consumer: req.user._id }).populate('serviceProvider', 'username email');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.getBookingsForServiceProvider = async (req, res) => {
  try {
    const bookings = await Booking.find({ serviceProvider: req.user._id }).populate('consumer', 'username email');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    
    // Update the status of a booking
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};
