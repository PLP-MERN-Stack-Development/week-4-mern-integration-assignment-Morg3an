const express = require('express');
const { body } = require('express-validator');
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { upload } = require('../middleware/uploadMiddleware');


const router = express.Router();

// Public
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected - Create post
router.post(
    '/',
    protect,
    upload.single('featuredImage'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        body('category').notEmpty().withMessage('Category is required'),
    ],
    validateRequest,
    createPost
);

// Protected - Update post
router.put(
    '/:id',
    protect,
    [
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().notEmpty().withMessage('Content cannot be empty'),
        body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    ],
    validateRequest,
    updatePost
);

// Protected - Delete post
router.delete('/:id', protect, deletePost);

// Protected - Add comment to a post
router.post(
    '/:id/comments',
    protect,
    [body('content').notEmpty().withMessage('Comment content is required')],
    validateRequest,
    addComment
);

module.exports = router;