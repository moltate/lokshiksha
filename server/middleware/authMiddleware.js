const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Login karo pehle' });
    }

    
    const token = authHeader.split(' ')[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    next(); 

  } catch (error) {
    res.status(401).json({ message: 'Token invalid hai, dobara login karo' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Tumhare paas permission nahi hai' 
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };