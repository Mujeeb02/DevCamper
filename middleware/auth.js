const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Ensure token exists
    if (!token) {
      console.log("Token not found");
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  
    try {
      console.log("Token:", token);
      console.log("JWT_SECRET:", process.env.JWT_SECRET);
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
      req.user = await User.findById(decoded.id);
      
      next();
    } catch (err) {
      console.log("JWT verification failed:", err);
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  });
  

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `User role ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    };
  };