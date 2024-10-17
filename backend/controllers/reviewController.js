const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const { reviewee, rating, comment, service } = req.body;
    const reviewer = req.user._id;

    if (!reviewer) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await Review.create({
      reviewer,
      reviewee,
      rating,
      comment,
      service
    });

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || (user.userType !== 'business' && user.userType !== 'artisan')) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'username')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer.toString() !== reviewerId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const reviewerId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer.toString() !== reviewerId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};