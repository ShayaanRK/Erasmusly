const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
   user: process.env.DB_USER || 'postgres',
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'erasmusly',
   password: process.env.DB_PASSWORD || 'postgres',
   port: process.env.DB_PORT || 5432,
});

const generateUsers = async () => {
   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash('123456', salt);

   return [
      {
         name: 'Sophia Muller',
         email: 'sophia@example.com',
         password,
         university: 'Technical University of Berlin',
         city: 'Berlin',
         country: 'Germany',
         budget_range: '800-1200',
         interests: ['Techno', 'Coding', 'Hiking'],
         bio: 'Looking for a chill roommate who loves techno!',
         profile_picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      },
      {
         name: 'Lucas Silva',
         email: 'lucas@example.com',
         password,
         university: 'University of Lisbon',
         city: 'Lisbon',
         country: 'Portugal',
         budget_range: '500-800',
         interests: ['Surfing', 'Guitar', 'Cooking'],
         bio: 'Erasmus student from Brazil. Love to surf and cook feijoada!',
         profile_picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      },
      {
         name: 'Emma Dubois',
         email: 'emma@example.com',
         password,
         university: 'Sorbonne University',
         city: 'Paris',
         country: 'France',
         budget_range: '1000-1500',
         interests: ['Art', 'Museums', 'Wine'],
         bio: 'Art history student. Let\'s explore the Louvre together.',
         profile_picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      },
      {
         name: 'Matteo Rossi',
         email: 'matteo@example.com',
         password,
         university: 'Sapienza University of Rome',
         city: 'Rome',
         country: 'Italy',
         budget_range: '600-900',
         interests: ['Football', 'Pasta', 'History'],
         bio: 'Ciao! I make the best carbonara in town.',
         profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      },
      {
         name: 'Anya Ivanova',
         email: 'anya@example.com',
         password,
         university: 'University of Warsaw',
         city: 'Warsaw',
         country: 'Poland',
         budget_range: '400-700',
         interests: ['Photography', 'Travel', 'Reading'],
         bio: 'Digital nomad and student. Always looking for the next adventure.',
         profile_picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      },
      {
         name: 'Liam O\'Connor',
         email: 'liam@example.com',
         password,
         university: 'Trinity College Dublin',
         city: 'Dublin',
         country: 'Ireland',
         budget_range: '900-1300',
         interests: ['Pubs', 'Music', 'Rugby'],
         bio: 'Here for a good time, not a long time!',
         profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      },
   ];
};

const housingPosts = [
   {
      title: 'Cozy Room in Mitte',
      description: 'Bright room in a shared apartment, close to Alexanderplatz.',
      price: 650,
      city: 'Berlin',
      address: 'Torstrasse 12, Berlin',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'],
   },
   {
      title: 'Sunny Studio in Alfama',
      description: 'Beautiful studio with river view.',
      price: 800,
      city: 'Lisbon',
      address: 'Rua dos Remédios 45, Lisbon',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'],
   },
   {
      title: 'Chic Apartment near Eiffel Tower',
      description: 'Small but stylish apartment in the 7th arrondissement.',
      price: 1200,
      city: 'Paris',
      address: 'Rue Saint-Dominique, Paris',
      images: ['https://images.unsplash.com/photo-1502005229766-939cb93c598b?auto=format&fit=crop&w=1000&q=80'],
   },
   {
      title: 'Historic Room in Trastevere',
      description: 'Live like a local in the heart of Rome.',
      price: 700,
      city: 'Rome',
      address: 'Via della Lungaretta, Rome',
      images: ['https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1000&q=80'],
   },
   {
      title: 'Modern Flat in Downtown',
      description: 'Fully furnished apartment with gym access.',
      price: 550,
      city: 'Warsaw',
      address: 'Złota 44, Warsaw',
      images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80'],
   },
];

const events = [
   {
      title: 'Erasmus Welcome Party',
      description: 'Meet fellow students and enjoy free drinks!',
      location: 'The Student Union',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
   },
   {
      title: 'City Walking Tour',
      description: 'Explore the hidden gems of the city with a local guide.',
      location: 'City Center Plaza',
      event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
   },
   {
      title: 'International Food Night',
      description: 'Bring a dish from your country and share with others.',
      location: 'Community Hall',
      event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
   },
];

const seed = async () => {
   try {
      console.log('Connecting to database...');
      await pool.query('SELECT NOW()'); // Test connection

      console.log('Cleaning database...');
      await pool.query('TRUNCATE TABLE messages, chat_room_participants, chat_rooms, events, housing_posts, users RESTART IDENTITY CASCADE');

      console.log('Seeding Users...');
      const usersData = await generateUsers();
      const createdUsers = [];

      for (const user of usersData) {
         const res = await pool.query(
            `INSERT INTO users (name, email, password, university, city, country, budget_range, interests, bio, profile_picture) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [user.name, user.email, user.password, user.university, user.city, user.country, user.budget_range, user.interests, user.bio, user.profile_picture]
         );
         createdUsers.push(res.rows[0]);
      }
      console.log(`✅ Seeded ${createdUsers.length} users.`);

      console.log('Seeding Housing Posts...');
      for (const [index, post] of housingPosts.entries()) {
         // Assign posts to the first separate users to keep it simple, or random
         const owner = createdUsers[index % createdUsers.length];
         await pool.query(
            `INSERT INTO housing_posts (title, description, price, city, address, images, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [post.title, post.description, post.price, post.city, post.address, post.images, owner.id]
         );
      }
      console.log(`✅ Seeded ${housingPosts.length} housing posts.`);

      console.log('Seeding Events...');
      for (const [index, event] of events.entries()) {
         const organizer = createdUsers[index % createdUsers.length];
         await pool.query(
            `INSERT INTO events (title, description, location, event_date, user_id) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [event.title, event.description, event.location, event.event_date, organizer.id]
         );
      }
      console.log(`✅ Seeded ${events.length} events.`);

      console.log('✅ Seeding completed successfully!');
      process.exit(0);
   } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
   }
};

seed();
