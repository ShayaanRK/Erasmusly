const db = require('../config/db');

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
   const { title, description, location, date } = req.body;

   try {
      const result = await db.query(
         `INSERT INTO events (title, description, location, event_date, user_id) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
         [title, description, location, new Date(date), req.user.id]
      );

      const createdEvent = result.rows[0];
      res.status(201).json({ ...createdEvent, _id: createdEvent.id });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Get events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
   try {
      const result = await db.query(`
         SELECT e.*, u.name as user_name 
         FROM events e
         JOIN users u ON e.user_id = u.id
         WHERE e.event_date >= NOW()
         ORDER BY e.event_date ASC
      `);

      const events = result.rows;

      const formattedEvents = events.map(event => ({
         _id: event.id,
         title: event.title,
         description: event.description,
         location: event.location,
         date: event.event_date,
         createdAt: event.created_at,
         updatedAt: event.updated_at,
         createdBy: {
            _id: event.user_id,
            name: event.user_name
         }
      }));

      res.json(formattedEvents);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

module.exports = { createEvent, getEvents };
