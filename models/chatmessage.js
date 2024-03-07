'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatMessage.init({
    sender: DataTypes.STRING,
    message: DataTypes.STRING,
    roomId: DataTypes.STRING,
    privateChatUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChatMessage',
  });
  return ChatMessage;
};