// src/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { graphqlHTTP } = require('express-graphql');
const sequelize = require('../config/database');
const schema = require('../graphql/schema');
const Chat = require('../models/Chat');
const verifyToken = require('../middleware/authenticate');



const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Sync MySQL database
sequelize.sync().then(() => {
  console.log('Database synchronized.');
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle new chat messages
  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', data); // Broadcast to all connected clients

        // Save the message to MySQL database
      //  const { sender, message } = data;
      //  Chat.create({ sender, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphQL web interface for testing
  }));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
