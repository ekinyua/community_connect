const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { serviceProvider, consumer, date, startTime, endTime, service, status, notes } = req.body;

    if (!serviceProvider) {
      return res.status(400).json({ message: 'Service provider is required' });
    }

    const booking = new Booking({
      serviceProvider,
      consumer,
      date,
      startTime,
      endTime,
      service,
      status,
      notes
    });

    const savedBooking = await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
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