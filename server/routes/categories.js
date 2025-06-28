const express = require('express');
const { body } = require('express-validator');
const {
    getCategories,
    createCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public
router.get('/', getCategories);

// Protected - Create category
router.post(
    '/',
    protect,
    [body('name').notEmpty().withMessage('Category name is required')],
    validateRequest,
    createCategory
);

module.exports = router;