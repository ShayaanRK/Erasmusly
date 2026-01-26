const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET || 'erasmuslyseqret', {
      expiresIn: '30d',
   });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
   const { name, email, password, university, city, country, budgetRange, interests, bio } = req.body;

   try {
      const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

      if (userExists.rows.length > 0) {
         return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await db.query(
         `INSERT INTO users (name, email, password, university, city, country, budget_range, interests, bio) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
         [name, email, hashedPassword, university, city, country, budgetRange, interests || [], bio]
      );

      const user = newUser.rows[0];

      res.status(201).json({
         _id: user.id,
         name: user.name,
         email: user.email,
         city: user.city,
         profilePicture: user.profile_picture,
         token: generateToken(user.id),
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
   const { email, password } = req.body;

   try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (user && (await bcrypt.compare(password, user.password))) {
         res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            city: user.city,
            profilePicture: user.profile_picture,
            token: generateToken(user.id),
         });
      } else {
         res.status(401).json({ message: 'Invalid email or password' });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
   try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      const user = result.rows[0];

      if (user) {
         res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            university: user.university,
            city: user.city,
            country: user.country,
            budgetRange: user.budget_range,
            interests: user.interests,
            bio: user.bio,
            profilePicture: user.profile_picture,
         });
      } else {
         res.status(404).json({ message: 'User not found' });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
   const { name, email, university, city, country, budgetRange, interests, bio, password } = req.body;

   try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      const user = result.rows[0];

      if (user) {
         const updatedName = name || user.name;
         const updatedEmail = email || user.email;
         const updatedUniversity = university || user.university;
         const updatedCity = city || user.city;
         const updatedCountry = country || user.country;
         const updatedBudgetRange = budgetRange || user.budget_range;
         const updatedInterests = interests || user.interests;
         const updatedBio = bio || user.bio;

         let updatedPassword = user.password;
         if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(password, salt);
         }

         const updatedResult = await db.query(
            `UPDATE users SET name = $1, email = $2, university = $3, city = $4, country = $5, 
             budget_range = $6, interests = $7, bio = $8, password = $9, updated_at = NOW() 
             WHERE id = $10 RETURNING *`,
            [updatedName, updatedEmail, updatedUniversity, updatedCity, updatedCountry,
               updatedBudgetRange, updatedInterests, updatedBio, updatedPassword, req.user.id]
         );

         const updatedUser = updatedResult.rows[0];

         res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            city: updatedUser.city,
            profilePicture: updatedUser.profile_picture,
            token: generateToken(updatedUser.id),
         });
      } else {
         res.status(404).json({ message: 'User not found' });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Get matches for user
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res) => {
   try {
      const currentUserResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      const currentUser = currentUserResult.rows[0];

      if (!currentUser) return res.status(404).json({ message: 'User not found' });

      const allUsersResult = await db.query('SELECT * FROM users WHERE id != $1', [currentUser.id]);
      const allUsers = allUsersResult.rows;

      const scoredUsers = allUsers.map(user => {
         let score = 0;

         if (user.city && currentUser.city && user.city.toLowerCase() === currentUser.city.toLowerCase()) {
            score += 3;
         }

         if (user.university && currentUser.university && user.university.toLowerCase() === currentUser.university.toLowerCase()) {
            score += 2;
         }

         if (user.budget_range && currentUser.budget_range && user.budget_range === currentUser.budget_range) {
            score += 2;
         }

         if (user.interests && currentUser.interests) {
            const shared = user.interests.filter(i => currentUser.interests.includes(i));
            score += shared.length;
         }

         return {
            ...user,
            _id: user.id,
            profilePicture: user.profile_picture,
            budgetRange: user.budget_range,
            score
         };
      });

      scoredUsers.sort((a, b) => b.score - a.score);

      res.json(scoredUsers.slice(0, 5));
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getMatches };
