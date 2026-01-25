const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');
dotenv.config();

const app = express();

const server = http.createServer(app);

// Socket.io setup (Optional Real-time)
const io = new Server(server, {
   cors: {
      origin: "*", // allow all for ease of development 
      methods: ["GET", "POST"]
   }
});

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
   res.send('Erasmusly API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/housing', require('./routes/housingRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));


// Socket.io connection
io.on('connection', (socket) => {
   console.log('A user connected:', socket.id);

   socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
   });

   socket.on('send_message', (data) => {
      // Broadcast to room
      socket.to(data.room).emit('receive_message', data);
   });

   socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
   });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
