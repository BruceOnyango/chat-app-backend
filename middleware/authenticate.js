// middleware/authenticate.js

require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const secretKey  = process.env.JWT_SECRET // Replace with your actual secret key

const verifyToken = (req, res, next) => {
    //const authHeader = req.headers['authorization'];
    const authHeader = req.headers && req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
  
      req.user = user;
      next();
    });
};

module.exports = verifyToken;
