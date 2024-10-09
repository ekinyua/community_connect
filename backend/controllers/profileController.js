const Profile = require('../models/Profile');
const User = require('../models/User');

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    const profileData = { ...req.body, user: userId };
    const newProfile = await Profile.create(profileData);

    res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const profile = await Profile.findOne({ user: userId }).populate('user', 'username email userType');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    Object.assign(profile, req.body);
    await profile.save();

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
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

exports.getAllProfiles = async (req, res) => {
  try {
    const { userType, service, location } = req.query;
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

    const profiles = await Profile.find(query).populate('user', 'username email userType');
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
};