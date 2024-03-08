// src/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const socketIO = require('socket.io');
const { graphqlHTTP } = require('express-graphql');
const sequelize = require('../config/database');
const schema = require('../graphql/schema');
const Chat = require('../models/Chat');
const verifyToken = require('../middleware/authenticate');



const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const wss = new WebSocket.Server({ server });

// Sync MySQL database
sequelize.sync().then(() => {
  console.log('Database synchronized.');
});

// WebSocket connection
/*io.on('connection', (socket) => {
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
}); */

wss.on('connection', (socket) => {
    console.log('WebSocket connection established:', socket);
  
    // Handle WebSocket events
    socket.on('message', (data) => {
      console.log('Received message:', data);
      // Handle the incoming message
    });
  
    socket.on('close', () => {
      console.log('WebSocket connection closed');
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
