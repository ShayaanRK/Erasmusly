const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');
dotenv.config();

const app = express();

const server = http.createServer(app);

// Socket.io setup with consistent naming
const io = new Server(server, {
   cors: {
      origin: "http://localhost:5173", // specify frontend origin
      methods: ["GET", "POST"]
   }
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
   res.send('Erasmusly API is running...');
});

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/housing', require('./routes/housingRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));

// Socket.io connection logic
io.on('connection', (socket) => {
   console.log('Connected to socket.io');

   socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
   });

   socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User Joined Room: ' + room);
   });

   socket.on('new message', (newMessageReceived) => {
      var chat = newMessageReceived.chat;

      if (!chat) return console.log('chat not defined');

      // In this setup, we broadcast to the room
      socket.to(chat).emit('message received', newMessageReceived);
   });

   socket.off('setup', () => {
      console.log('USER DISCONNECTED');
      socket.leave(userData._id);
   });
});

// Error Handling Middlewares
app.use((req, res, next) => {
   const error = new Error(`Not Found - ${req.originalUrl}`);
   res.status(404);
   next(error);
});

app.use((err, req, res, next) => {
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
   res.status(statusCode);
   res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
   });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
