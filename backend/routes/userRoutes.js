const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, getMatches } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/matches', protect, getMatches);

module.exports = router;
