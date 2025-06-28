const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({ name, email, password });

    res.status(201).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token: user.generateToken(),
    });
});

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token: user.generateToken(),
    });
});
