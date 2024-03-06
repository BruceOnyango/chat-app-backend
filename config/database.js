// config/database.js
//require('dotenv').config();
require('dotenv').config({ path: '../.env' });

const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    dialect:  'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME ,
    password: '' ,
    database: process.env.DB_DATABASE,
});

module.exports = sequelize;
