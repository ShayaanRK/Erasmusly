const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      try {
         token = req.headers.authorization.split(' ')[1];
         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'erasmuslyseqret');

         const result = await db.query('SELECT id, email, name, city, profile_picture FROM users WHERE id = $1', [decoded.id]);
         req.user = result.rows[0];

         if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
         }

         next();
      } catch (error) {
         console.error(error);
         res.status(401).json({ message: 'Not authorized, token failed' });
      }
   }

   if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
   }
};

module.exports = { protect };
