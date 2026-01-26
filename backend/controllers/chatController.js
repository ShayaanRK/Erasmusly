const db = require('../config/db');

// @desc    Create or access chat room between two users
// @route   POST /api/chat
// @access  Private
const accessChat = async (req, res) => {
   const { userId } = req.body; // The other user

   try {
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
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Fetch all chats for user
// @route   GET /api/chat
// @access  Private
const fetchChats = async (req, res) => {
   try {
      const result = await db.query(`
         SELECT cr.id, cr.updated_at
         FROM chat_rooms cr
         JOIN chat_room_participants crp ON cr.id = crp.chat_room_id
         WHERE crp.user_id = $1
         ORDER BY cr.updated_at DESC
      `, [req.user.id]);

      const chats = [];
      for (const row of result.rows) {
         chats.push(await fetchChatDetails(row.id));
      }

      res.status(200).send(chats);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// @desc    Send message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
   const { chatId, content } = req.body;

   if (!content || !chatId) {
      return res.sendStatus(400);
   }

   try {
      await db.query('INSERT INTO messages (chat_room_id, user_id, text) VALUES ($1, $2, $3)',
         [chatId, req.user.id, content]);

      // Update chat room timestamp
      await db.query('UPDATE chat_rooms SET updated_at = NOW() WHERE id = $1', [chatId]);

      const chatData = await fetchChatDetails(chatId);
      res.json(chatData);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
};

// Helper function to fetch participants and messages
const fetchChatDetails = async (chatRoomId) => {
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
};

module.exports = { accessChat, fetchChats, sendMessage };
