
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = ChatRoomMembers;


