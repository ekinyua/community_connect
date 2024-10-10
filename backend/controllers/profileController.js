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
    const userId = req.params.userId || req.user._id;
    let profile = await Profile.findOne({ user: userId }).populate('user', 'username email userType basicProfile');

    if (!profile) {
      // If no profile exists, create one with basic info from User model
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      profile = await Profile.create({
        user: user._id,
        bio: user.basicProfile.bio,
        location: user.basicProfile.location,
        profilePicture: user.basicProfile.profilePicture
      });

      // Populate the user field after creation
      await profile.populate('user', 'username email userType basicProfile');
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
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