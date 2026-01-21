const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  let token;

  // 1. Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If token not found
  if (!token) {
    return res.status(401).json({ message: 'Token missing, login required' });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    req.user = await User.findById(decoded.id).select('-password');

    next(); // allow request
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

//admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access only'
    });
  }
  next();
};
module.exports = { protect, adminOnly };
