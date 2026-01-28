const db = require('../config/db');

// @desc    Create housing post
// @route   POST /api/housing
// @access  Private
const createPost = async (req, res) => {
   const { title, description, price, city, address, images } = req.body;

   try {
      // Validate required fields
      if (!title || !price || !city) {
         return res.status(400).json({ message: 'Please provide title, price, and city' });
      }

      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      // Validate price is a positive number
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
         return res.status(400).json({ message: 'Please provide a valid price greater than 0' });
      }

      // Validate title length
      if (title.trim().length <= 3) {
         return res.status(400).json({ message: 'Title must be at least 3 characters long' });
      }

      const result = await db.query(
         `INSERT INTO housing_posts (title, description, price, city, address, images, user_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
         [title.trim(), description?.trim() || '', parsedPrice, city.trim(), address?.trim() || '', images || [], req.user.id]
      );

      const post = result.rows[0];

      // Return formatted post
      res.status(201).json({
         ...post,
         _id: post.id,
         createdBy: {
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email
         }
      });
   } catch (error) {
      console.error("Post creation error:", error);
      res.status(500).json({ message: 'Failed to create housing post. Please try again later.' });
   }
};

// @desc    Get all housing posts
// @route   GET /api/housing
// @access  Private
const getPosts = async (req, res) => {
   const { city, minPrice, maxPrice } = req.query;

   try {
      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      let queryText = `
         SELECT hp.*, u.name, u.email, u.profile_picture 
         FROM housing_posts hp
         JOIN users u ON hp.user_id = u.id
         WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (city) {
         queryText += ` AND hp.city ILIKE $${paramIndex}`;
         params.push(`%${city}%`);
         paramIndex++;
      }

      if (minPrice) {
         const parsedMin = parseFloat(minPrice);
         if (!isNaN(parsedMin) && parsedMin >= 0) {
            queryText += ` AND hp.price >= $${paramIndex}`;
            params.push(parsedMin);
            paramIndex++;
         }
      }

      if (maxPrice) {
         const parsedMax = parseFloat(maxPrice);
         if (!isNaN(parsedMax) && parsedMax >= 0) {
            queryText += ` AND hp.price <= $${paramIndex}`;
            params.push(parsedMax);
            paramIndex++;
         }
      }

      queryText += ' ORDER BY hp.created_at DESC';

      const result = await db.query(queryText, params);
      const posts = result.rows;

      const formattedPosts = posts.map(post => ({
         _id: post.id,
         title: post.title,
         description: post.description,
         price: post.price,
         city: post.city,
         address: post.address,
         images: post.images,
         createdAt: post.created_at,
         updatedAt: post.updated_at,
         createdBy: {
            _id: post.user_id,
            name: post.name,
            email: post.email,
            profilePicture: post.profile_picture
         }
      }));

      res.json(formattedPosts);
   } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ message: 'Failed to fetch housing posts. Please try again later.' });
   }
};

module.exports = { createPost, getPosts };
