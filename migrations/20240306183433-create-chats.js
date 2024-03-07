'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      receiver: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chats');
  }
};
