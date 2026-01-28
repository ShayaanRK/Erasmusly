const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();


// Use DATABASE_URL for production (Render/Supabase), fallback to individual params for local
const pool = process.env.DATABASE_URL
   ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
   })
   : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'erasmusly',
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
   });

// Test connection
pool.query('SELECT NOW()', (err, res) => {
   if (err) {
      console.error('Error connecting to the database', err.stack);
   } else {
      console.log('PostgreSQL Connected:', res.rows[0].now);
   }
});

module.exports = {
   query: (text, params) => pool.query(text, params),
};
