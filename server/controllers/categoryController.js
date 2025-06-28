const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
        res.status(400);
        throw new Error('Category already exists');
    }

    // Use .save() to ensure pre-save hooks run
    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
});
