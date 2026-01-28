const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Verifying Database Connection...\n');

// Show which connection method will be used
if (process.env.DATABASE_URL) {
   console.log('✅ Using DATABASE_URL (Supabase)');
   console.log('   Connection string:', process.env.DATABASE_URL.substring(0, 50) + '...\n');
} else {
   console.log('⚠️  Using individual DB parameters (localhost)');
   console.log('   Host:', process.env.DB_HOST || 'localhost');
   console.log('   Database:', process.env.DB_NAME || 'erasmusly');
   console.log('   User:', process.env.DB_USER || 'postgres\n');
}

// Create pool using same logic as config/db.js
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

async function verify() {
   try {
      console.log('🔌 Testing connection...');

      // Test basic connection
      const timeResult = await pool.query('SELECT NOW() as current_time');
      console.log('✅ Connection successful!');
      console.log('   Server time:', timeResult.rows[0].current_time);

      // Get database info
      const dbInfo = await pool.query(`
            SELECT 
                current_database() as database_name,
                current_user as user_name,
                version() as postgres_version
        `);
      console.log('\n📊 Database Information:');
      console.log('   Database:', dbInfo.rows[0].database_name);
      console.log('   User:', dbInfo.rows[0].user_name);
      console.log('   Version:', dbInfo.rows[0].postgres_version.split(',')[0]);

      // Check if tables exist
      console.log('\n📋 Checking tables...');
      const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

      if (tables.rows.length === 0) {
         console.log('⚠️  No tables found! Database might not be initialized.');
      } else {
         console.log('✅ Found', tables.rows.length, 'tables:');
         tables.rows.forEach(row => console.log('   -', row.table_name));
      }

      // Check data in key tables
      console.log('\n📈 Checking data...');

      try {
         const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
         console.log('   Users:', userCount.rows[0].count);
      } catch (err) {
         console.log('   Users: Table not found or error');
      }

      try {
         const housingCount = await pool.query('SELECT COUNT(*) as count FROM housing_posts');
         console.log('   Housing Posts:', housingCount.rows[0].count);
      } catch (err) {
         console.log('   Housing Posts: Table not found or error');
      }

      try {
         const eventCount = await pool.query('SELECT COUNT(*) as count FROM events');
         console.log('   Events:', eventCount.rows[0].count);
      } catch (err) {
         console.log('   Events: Table not found or error');
      }

      // List some users if they exist
      try {
         const users = await pool.query('SELECT id, name, email, city FROM users LIMIT 3');
         if (users.rows.length > 0) {
            console.log('\n👥 Sample Users:');
            users.rows.forEach(user => {
               console.log(`   - ${user.name} (${user.email}) from ${user.city || 'Unknown'}`);
            });
         }
      } catch (err) {
         // Ignore if table doesn't exist
      }

      console.log('\n✅ Verification complete!');

   } catch (error) {
      console.error('\n❌ Connection failed!');
      console.error('Error:', error.message);
      console.error('\nPossible causes:');
      console.error('- Database credentials are incorrect');
      console.error('- Database server is not running');
      console.error('- Network/firewall blocking connection');
      console.error('- SSL configuration issue');
   } finally {
      await pool.end();
      process.exit(0);
   }
}

verify();
