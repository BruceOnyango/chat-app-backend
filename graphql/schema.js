// src/graphql/schema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID } = require('graphql');
const AuthService = require('../services/auth');
const Chat = require('../models/Chat');
//const { authenticate } = require('../middleware/authenticate');
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
    // Add other user fields as needed
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
      },
      resolve(parent, args, context) {
       

        const { sender, message } = args;
        return Chat.create({ sender, message }).then(() => 'Message posted successfully!');
      },
    },
    signUp: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return AuthService.signUp(args.username, args.password);
      },
    },
    signIn: {
      type: UserType,
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
