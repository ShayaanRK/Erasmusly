const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();


// STRICTLY enforce Supabase connection
if (!process.env.DATABASE_URL) {
   console.error('❌ FATAL ERROR: DATABASE_URL is missing in .env');
   console.error('❌ The application is configured to ONLY use the seeded Supabase database.');
   process.exit(1);
}

console.log('🔌 Initializing Database Connection Pool...');
console.log(`   Target: ${process.env.DATABASE_URL.includes('supabase') ? '✅ Supabase' : '⚠️ Unknown DB'}`);

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false }, // Required for Supabase
   connectionTimeoutMillis: 10000,
   idleTimeoutMillis: 30000,
});

// Test connection on startup
pool.query('SELECT NOW() as now, current_database() as db_name', (err, res) => {
   if (err) {
      console.error('❌ DATABASE CONNECTION FAILED:', err.message);
      // We don't exit here to allow retry logic if needed, but this is critical
   } else {
      console.log('✅ CONNECTED TO SUPABASE DATABASE');
      console.log('   Database:', res.rows[0].db_name);
      console.log('   Time:', res.rows[0].now);
   }
});

module.exports = {
   query: (text, params) => pool.query(text, params),
};
