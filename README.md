# Chat App Backend Documentation

## GraphQL API Documentation

# Setup Instructions
Prerequisites
Node.js installed
MySQL database configured

# Installation
Clone the repository:
```console
git clone https://github.com/BruceOnyango/chat-app-backend.git


```
Install dependencies:
```console
cd chat-app-backend
npm install



```
# Database Migrations
Run the following command to apply database migrations:
```console
npx sequelize-cli db:migrate




```
# Start the Application
Start the server with the following command:
```console
node index.js




```


# Usage Guidelines
# Authentication:

Use the Authorization header with the format Bearer <token> for authenticated requests.
Obtain a user token through the signUp or signIn mutations.

# Real-Time Communication:

Connect to the WebSocket server at ws://your-api-url to receive real-time updates.
Listen for events such as NEW_MESSAGE, USER_JOINED, and USER_LEFT for real-time notifications.

# Creating and Managing Rooms:

Use the createRoom mutation to create chat rooms.
Use the deleteRoom mutation to delete chat rooms.
Use the joinRoom mutation to join existing chat rooms.

# Sending Messages:

Use the postMessage mutation to send direct messages to other users.
Use the sendMessageToRoom mutation to send messages to a specific chat room.
