const passport = require('passport');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, userType } = req.body;
    const user = await User.create({ username, email, password, userType });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json({ message: 'User created successfully', user: { id: user._id, username: user.username, email: user.email, userType: user.userType } });
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Logged in successfully', user: { id: user._id, username: user.username, email: user.email, userType: user.userType } });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Error logging out', error: err.message });
    res.json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, userType: req.user.userType } });
};