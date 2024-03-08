
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChatMessages = require('../models/chatmessage'); 

const ChatRoomMembers = sequelize.define('chatroommembers', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING
      },
      chatroomName: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
});

// Define associations
//ChatRoomMembers.hasMany(ChatMessages, { foreignKey: 'chatroomName' });
//ChatMessages.belongsTo(ChatRoomMembers, { foreignKey: 'chatroomName' });

module.exports = ChatRoomMembers;


