const express = require('express');
const router = express.Router();
const { accessChat, fetchChats, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, accessChat).get(protect, fetchChats);
router.route('/message').post(protect, sendMessage);

module.exports = router;
