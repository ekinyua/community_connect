const Profile = require('../models/Profile');
const User = require('../models/User');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      Object.assign(profile, req.body);
      await profile.save();
      res.json({ message: 'Profile updated successfully', profile });
    } else {
      // Create new profile
      const profileData = { ...req.body, user: userId };
      profile = await Profile.create(profileData);
      res.status(201).json({ message: 'Profile created successfully', profile });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating profile', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }


    let profile = await Profile.findOne({ user: userId }).populate('user', 'username email userType basicProfile');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Backend: Error in getProfile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// new function to get the current user's profile
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ user: userId }).populate('user', 'username email userType basicProfile');

    if (!profile) {

      profile = await Profile.create({
        user: userId,
        bio: req.user.basicProfile?.bio || '',
        location: req.user.basicProfile?.location || '',
        profilePicture: req.user.basicProfile?.profilePicture || 'default.jpg'
      });

      await profile.populate('user', 'username email userType basicProfile');
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    res.status(500).json({ message: 'Error fetching current user profile', error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Profile.findOneAndDelete({ user: userId });

    if (!result) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
};

exports.searchProfiles = async (req, res) => {
  try {
    const { userType, service, location, day, time } = req.query;
    let query = {};

    if (userType) {
      const users = await User.find({ userType });
      query.user = { $in: users.map(user => user._id) };
    }
    if (service) {
      query.services = { $regex: service, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (day && time) {
      query.availability = {
        $elemMatch: {
          day: day,
          startTime: { $lte: time },
          endTime: { $gte: time }
        }
      };
    }

    const profiles = await Profile.find(query).populate('user', 'username email userType');
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ message: 'Error searching profiles', error: error.message });
  }
};