// src/graphql/schema.js
const WebSocket = require('ws');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID } = require('graphql');
const AuthService = require('../services/auth');
const ChatService = require('../services/chat');
const Chat = require('../models/Chat');
const User = require('../models/user');
const verifyToken = require('../middleware/authenticate');
const ChatMessages = require('../models/chatmessage');
const ChatRoom = require('../models/chatRoom');

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Function to broadcast messages to all connected clients
const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    message: {
      type: GraphQLString,
      resolve(parent, args) {
        return 'Welcome to the Chat App GraphQL API!';
      },
    },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    token: { type: GraphQLString },
    // Add other user fields as needed
  }),
});

const AuthResponseType = new GraphQLObjectType({
  name: 'AuthResponse',
  fields: () => ({
    user: { type: UserType },
    token: { type: GraphQLString },
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    postMessage: {
      type: GraphQLString,
      args: {
        sender: { type: GraphQLString },
        message: { type: GraphQLString },
        receiver: { type: GraphQLString },
      },
      resolve: async (parent, args, context) => {
        const { authorization } = context.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
          throw new Error('Unauthorized: No token provided');
        }

        const token = authorization.split(' ')[1];

        try {
          // Verify the token and get the user
          const authenticatedUser = await verifyToken(token);



          // Access the authenticated user directly
          const { message, receiver } = args;


          const sender = authenticatedUser.username;




          // console.log(receiver)
          const userExists = await User.findOne({ where: { username: receiver } });
          // console.log(userExists.username);

          //can only send to available users only
          if (userExists) {
            const chat = await Chat.create({ sender, message, receiver });
            
            // Broadcast the new message to all connected clients
          const broadcastMessage = {
            type: 'NEW_MESSAGE',
            data: {
              id: chat.id,
              sender,
              message,
              receiver,
              createdAt: chat.createdAt,
            },
          };
          broadcast(broadcastMessage);
          return 'Message Posted Succesfully';

          }
          else {
            // Throw an error when the user does not exist
            throw new Error('User not found');
          }



        } catch (error) {
          console.log(error)
          throw error; // Propagate the error if authentication fails
        }
      },

    },
    signUp: {
      type: AuthResponseType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return AuthService.signUp(args.username, args.password);
      },
    },
    signIn: {
      type: AuthResponseType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return AuthService.signIn(args.username, args.password);
      },
    },
    createRoom: {
      type: GraphQLString,
      args: {
        name: { type: GraphQLString },

      },
      resolve: async (parent,  args, context) => {
        const { authorization } = context.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
          throw new Error('Unauthorized: No token provided');
        }

        const token = authorization.split(' ')[1];

        try {

          // Verify the token and get the user
          const authenticatedUser = await verifyToken(token);

          return ChatService.createRoom(args.name).then(() => 'Room created  successfully!');
        }
        catch (error) {
          throw error;
        }
      },
    },
    deleteRoom: {
      type: GraphQLString,
      args: {
        name: { type: GraphQLString },

      },
      resolve: async (parent,  args, context) => {
        const { authorization } = context.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
          throw new Error('Unauthorized: No token provided');
        }

        const token = authorization.split(' ')[1];

        try {

          // Verify the token and get the user
          const authenticatedUser = await verifyToken(token);

          return ChatService.deleteRoom(args.name).then(() => 'Room deleted  successfully!');
        }
        catch (error) {
          console.log(error)
          throw error;
        }
      },
    },
    joinRoom: {
      type: GraphQLString,
      args: {
        chatname: { type: GraphQLString },

      },
      resolve: async (parent,  args, context) => {
        const { authorization } = context.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
          throw new Error('Unauthorized: No token provided');
        }

        const token = authorization.split(' ')[1];

        try {

          // Verify the token and get the user
          const authenticatedUser = await verifyToken(token);

          return ChatService.joinRoom(authenticatedUser.username,args.chatname).then(() => 'Joined Room successfully!');
        }
        catch (error) {
          throw error;
        }
      },
    },
    
    message: {
      type: GraphQLString,
      args: {
        roomName: { type: GraphQLString },
        message: { type: GraphQLString },
       
      },
      resolve: async (parent, args, context) => {
        const { authorization } = context.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
          throw new Error('Unauthorized: No token provided');
        }

        const token = authorization.split(' ')[1];

        try {
          // Verify the token and get the user
          const authenticatedUser = await verifyToken(token);



          // Access the authenticated user directly
          const { message, roomName } = args;


          const sender = authenticatedUser.username;



          //can only send to available users only
          const roomExist = await ChatRoom.findOne({ where: { name: roomName}})
          // Create a new chatroom
          if (roomExist)
          {
             
              const room = await ChatMessages.create({
                  message: message,
                  sender : sender,
                  roomName: roomName
                 
              });

              const broadcastMessage = {
                type: 'NEW_MESSAGE',
                data: {
                  id: room.id,
                  sender,
                  message,
                  roomName,
                  createdAt: room.createdAt,
                },
              };
              broadcast(broadcastMessage);
  
              return 'Message Posted Succesfully';

          }
          else 
            {
               
                throw new Error('Room does not exist');
               
            }

         
            
         
        
        



        } catch (error) {
          console.log(error)
          throw error; // Propagate the error if authentication fails
        }
      },

    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
