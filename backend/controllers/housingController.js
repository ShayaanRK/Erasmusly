const db = require('../config/db');

// @desc    Create housing post
// @route   POST /api/housing
// @access  Private
const createPost = async (req, res) => {
   const { title, description, price, city, address, images } = req.body;

   try {
      const result = await db.query(
         `INSERT INTO housing_posts (title, description, price, city, address, images, user_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
         [title, description, parseFloat(price), city, address, images || [], req.user.id]
      );

      const createdPost = result.rows[0];
      res.status(201).json({ ...createdPost, _id: createdPost.id });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Get all housing posts
// @route   GET /api/housing
// @access  Private
const getPosts = async (req, res) => {
   const { city, minPrice, maxPrice } = req.query;

   try {
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
         queryText += ` AND hp.price >= $${paramIndex}`;
         params.push(parseFloat(minPrice));
         paramIndex++;
      }

      if (maxPrice) {
         queryText += ` AND hp.price <= $${paramIndex}`;
         params.push(parseFloat(maxPrice));
         paramIndex++;
      }

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
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

module.exports = { createPost, getPosts };
