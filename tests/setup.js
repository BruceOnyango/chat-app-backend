// tests/setup.js
 // Adjust the import based on your actual app location
 const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const { graphqlHTTP } = require('express-graphql');

const wss = new WebSocket.Server({ noServer: true });

const WebSocketMiddleware = (req, res, next) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    wss.emit('connection', ws, req);
  });
};

server.on('upgrade', WebSocketMiddleware);

beforeAll(() => server.listen(4000));
afterEach(() => server.close());

