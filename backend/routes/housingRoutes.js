const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/housingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPosts).post(protect, createPost);

module.exports = router;
