const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

// @desc    Get all posts
// @route   GET /api/posts
exports.getPosts = asyncHandler(async (req, res) => {
    const query = {};

    if (req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
        query.category = req.query.category;
    }
    const posts = await Post.find(query).populate('author').populate('category');
    res.json(posts);
});

// @desc    Get single post
// @route   GET /api/posts/\:id
exports.getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author').populate('category');
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    res.json(post);
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
    const { title, content, category, excerpt, tags } = req.body;

    const newPost = new Post({
        title,
        content,
        category,
        excerpt,
        author: req.user._id,
        tags: Array.isArray(tags) ? tags : tags?.split(',').map(t => t.trim()),
    });

    // Save featured image path if uploaded
    if (req.file) {
        newPost.featuredImage = `/uploads/posts/${req.file.filename}`;
    }

    const created = await newPost.save();
    res.status(201).json(created);
});

// @desc    Update an existing post
// @route   PUT /api/posts/\:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this post');
    }

    const updatedFields = req.body;
    Object.assign(post, updatedFields);

    const updatedPost = await post.save();
    res.json(updatedPost);


});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this post');
    }

    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post deleted successfully' });
});


// @desc    Add a comment to a post
// @route   POST /api/posts/\:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    await post.addComment(req.user._id, req.body.content);

    res.status(201).json({ message: 'Comment added successfully' });

});