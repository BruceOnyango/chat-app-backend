// middleware/authenticate.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;


const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        reject(new Error('Unauthorized: Invalid token'));
      } else {
        resolve(user);
      }
    });
  });
};

module.exports = verifyToken;
