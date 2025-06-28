// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (err) {
            console.error(err);
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Optional: restrict to specific roles (e.g. admin)
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied, admin only');
    }
};