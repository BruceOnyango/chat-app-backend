// tests/websocket.test.js
const WebSocket = require('ws');
const http = require('http');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
//const { SubscriptionServer } = require('subscriptions-transport-ws');
const { SubscriptionServer } = require('subscriptions-transport-ws/dist/server');

const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('../src/graphql/schema'); // Adjust the import based on your actual schema location
const resolvers = require('../src/graphql/resolvers'); // Adjust the import based on your actual resolver location

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  // Handle WebSocket connections as needed
});

const subscriptionServer = new SubscriptionServer(
  {
    execute,
    subscribe,
    schema,
  },
  {
    server: wsServer,
    path: '/subscriptions',
  }
);

wsServer.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wsServer.listen(4001, () => {
  console.log(`WebSocket server is running on port 4001`);
});

describe('WebSocket: Message Broadcasting', () => {
  it('should broadcast messages to connected clients', (done) => {
    const client1 = new WebSocket('ws://localhost:4001/subscriptions');
    const client2 = new WebSocket('ws://localhost:4001/subscriptions');

    client1.on('message', (message) => {
      // Handle WebSocket messages as needed
      done();
    });

    client2.on('open', () => {
      // Send a message from client2
      client2.send(JSON.stringify({ type: 'NEW_MESSAGE', data: { message: 'Hello, world!' } }));
    });
  });
});
