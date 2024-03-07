// src/graphql/schema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID } = require('graphql');
const AuthService = require('../services/auth');
const Chat = require('../models/Chat');
const User = require('../models/user');
const  verifyToken  = require('../middleware/authenticate');

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
        receiver: {type: GraphQLString },
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
          const { message ,receiver } = args;


          const sender = authenticatedUser.username;

          

       
         // console.log(receiver)
          const userExists = await User.findOne({ where : { username:receiver } });
         // console.log(userExists.username);

          //can only send to available users only
          if(userExists)
          {
            return Chat.create({ sender, message, receiver }).then(() => 'Message posted successfully!');
          }
         else {
          // Throw an error when the user does not exist
          throw new Error('User not found');
        }
          

         
        } catch (error) {
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
