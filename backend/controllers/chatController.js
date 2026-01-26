const db = require('../config/db');

// @desc    Create or access chat room between two users
// @route   POST /api/chat
// @access  Private
const accessChat = async (req, res) => {
   const { userId } = req.body; // The other user

   try {
      // Validate input
      if (!userId) {
         return res.status(400).json({ message: 'Please provide userId' });
      }

      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      // Prevent creating chat with self
      if (userId === req.user.id) {
         return res.status(400).json({ message: 'Cannot create chat with yourself' });
      }

      // Verify the other user exists
      const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userCheck.rows.length === 0) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Find a chat room where both currently exist as participants
      const existingChatQuery = `
         SELECT chat_room_id FROM chat_room_participants 
         WHERE user_id IN ($1, $2)
         GROUP BY chat_room_id
         HAVING COUNT(DISTINCT user_id) = 2
      `;
      const existingResult = await db.query(existingChatQuery, [req.user.id, userId]);

      if (existingResult.rows.length > 0) {
         const chatRoomId = existingResult.rows[0].chat_room_id;

         // Fetch chat details
         const chatData = await fetchChatDetails(chatRoomId);
         res.status(200).json(chatData);
      } else {
         // Create new room
         const newRoomResult = await db.query('INSERT INTO chat_rooms DEFAULT VALUES RETURNING id');
         const chatRoomId = newRoomResult.rows[0].id;

         // Add participants
         await db.query('INSERT INTO chat_room_participants (chat_room_id, user_id) VALUES ($1, $2), ($3, $4)',
            [chatRoomId, req.user.id, chatRoomId, userId]);

         const chatData = await fetchChatDetails(chatRoomId);
         res.status(200).json(chatData);
      }
   } catch (error) {
      console.error('Access chat error:', error);
      res.status(500).json({ message: 'Failed to access chat. Please try again later.' });
   }
};

// @desc    Fetch all chats for user
// @route   GET /api/chat
// @access  Private
const fetchChats = async (req, res) => {
   try {
      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      const result = await db.query(`
         SELECT cr.id, cr.updated_at
         FROM chat_rooms cr
         JOIN chat_room_participants crp ON cr.id = crp.chat_room_id
         WHERE crp.user_id = $1
         ORDER BY cr.updated_at DESC
      `, [req.user.id]);

      if (result.rows.length === 0) {
         return res.status(200).send([]);
      }

      const chats = [];
      for (const row of result.rows) {
         chats.push(await fetchChatDetails(row.id));
      }

      res.status(200).send(chats);
   } catch (error) {
      console.error('Fetch chats error:', error);
      res.status(500).json({ message: 'Failed to fetch chats. Please try again later.' });
   }
};

// @desc    Send message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
   const { chatId, text } = req.body;

   try {
      // Validate input
      if (!text || !chatId) {
         return res.status(400).json({ message: 'ChatId and text are required' });
      }

      if (!text.trim()) {
         return res.status(400).json({ message: 'Message cannot be empty' });
      }

      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      // Verify chat room exists
      const chatCheck = await db.query('SELECT id FROM chat_rooms WHERE id = $1', [chatId]);
      if (chatCheck.rows.length === 0) {
         return res.status(404).json({ message: 'Chat room not found' });
      }

      // Verify user is a participant
      const participantCheck = await db.query(
         'SELECT * FROM chat_room_participants WHERE chat_room_id = $1 AND user_id = $2',
         [chatId, req.user.id]
      );
      if (participantCheck.rows.length === 0) {
         return res.status(403).json({ message: 'You are not a participant in this chat' });
      }

      const result = await db.query(
         'INSERT INTO messages (chat_room_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
         [chatId, req.user.id, text.trim()]
      );

      const message = result.rows[0];

      // Update chat room timestamp
      await db.query('UPDATE chat_rooms SET updated_at = NOW() WHERE id = $1', [chatId]);

      // Return full message with sender info
      res.json({
         _id: message.id,
         text: message.text,
         timestamp: message.created_at,
         chat: chatId,
         sender: {
            _id: req.user.id,
            name: req.user.name,
            profilePicture: req.user.profile_picture
         }
      });
   } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Failed to send message. Please try again later.' });
   }
};

// @desc    Get messages for a chat
// @route   GET /api/message/:chatId
// @access  Private
const getMessages = async (req, res) => {
   const { chatId } = req.params;

   try {
      if (!chatId) {
         return res.status(400).json({ message: 'Chat ID is required' });
      }

      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      // Verify chat room exists
      const chatCheck = await db.query('SELECT id FROM chat_rooms WHERE id = $1', [chatId]);
      if (chatCheck.rows.length === 0) {
         return res.status(404).json({ message: 'Chat room not found' });
      }

      // Verify user is a participant
      const participantCheck = await db.query(
         'SELECT * FROM chat_room_participants WHERE chat_room_id = $1 AND user_id = $2',
         [chatId, req.user.id]
      );
      if (participantCheck.rows.length === 0) {
         return res.status(403).json({ message: 'You are not a participant in this chat' });
      }

      const messagesResult = await db.query(`
         SELECT m.id, m.text, m.created_at as timestamp, u.id as sender_id, u.name as sender_name, u.profile_picture as sender_pic
         FROM messages m
         JOIN users u ON m.user_id = u.id
         WHERE m.chat_room_id = $1
         ORDER BY m.created_at ASC
      `, [chatId]);

      const messages = messagesResult.rows.map(m => ({
         _id: m.id,
         text: m.text,
         timestamp: m.timestamp,
         sender: {
            _id: m.sender_id,
            name: m.sender_name,
            profilePicture: m.sender_pic
         }
      }));

      res.status(200).json(messages);
   } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: 'Failed to fetch messages. Please try again later.' });
   }
};

// Helper function to fetch participants and messages
const fetchChatDetails = async (chatRoomId) => {
   try {
      const participantsResult = await db.query(`
         SELECT u.id, u.name, u.email, u.profile_picture
         FROM users u
         JOIN chat_room_participants crp ON u.id = crp.user_id
         WHERE crp.chat_room_id = $1
      `, [chatRoomId]);

      const messagesResult = await db.query(`
         SELECT m.id, m.text, m.created_at as timestamp, u.id as sender_id, u.name as sender_name, u.profile_picture as sender_pic
         FROM messages m
         JOIN users u ON m.user_id = u.id
         WHERE m.chat_room_id = $1
         ORDER BY m.created_at ASC
      `, [chatRoomId]);

      return {
         _id: chatRoomId,
         participants: participantsResult.rows.map(p => ({
            ...p,
            _id: p.id,
            profilePicture: p.profile_picture
         })),
         messages: messagesResult.rows.map(m => ({
            _id: m.id,
            text: m.text,
            timestamp: m.timestamp,
            sender: {
               _id: m.sender_id,
               name: m.sender_name,
               profilePicture: m.sender_pic
            }
         }))
      };
   } catch (error) {
      console.error('Fetch chat details error:', error);
      throw error;
   }
};

module.exports = { accessChat, fetchChats, sendMessage, getMessages };
