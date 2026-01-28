const db = require('../config/db');

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
   const { title, description, location, date } = req.body;

   try {
      // Validate required fields
      if (!title || !location || !date) {
         return res.status(400).json({ message: 'Please provide title, location, and date' });
      }

      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      // Validate title length
      if (title.trim().length < 3) {
         return res.status(400).json({ message: 'Title must be at least 3 characters long' });
      }

      // Validate date
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
         return res.status(400).json({ message: 'Please provide a valid date' });
      }

      // Check if date is in the past
      if (eventDate < new Date()) {
         return res.status(400).json({ message: 'Event date cannot be in the past' });
      }

      const result = await db.query(
         `INSERT INTO events (title, description, location, event_date, user_id) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
         [title.trim(), description?.trim() || '', location.trim(), eventDate, req.user.id]
      );

      const createdEvent = result.rows[0];
      res.status(201).json({ ...createdEvent, _id: createdEvent.id });
   } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ message: 'Failed to create event. Please try again later.' });
   }
};

// @desc    Get events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
   try {
      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

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
      console.error('Get events error:', error);
      res.status(500).json({ message: 'Failed to fetch events. Please try again later.' });
   }
};

module.exports = { createEvent, getEvents };
