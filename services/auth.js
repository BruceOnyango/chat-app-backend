const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assume you have a User model

class AuthService {
    async signUp(username, password) {
        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = await User.create({
                username,
                password: hashedPassword,
            });


            // Generate and return a JWT token
            const token = this.generateToken(user);

            return { user, token };


        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    async signIn(username, password) {
        try {
            // Find the user by username
            const user = await User.findOne({ where: { username } });

            if (!user) {
                throw new Error('User not found');
            }

            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error('Invalid password');
            }


            // Generate and return a JWT token
            const token = this.generateToken(user);

            return { user, token };


        } catch (error) {
            throw new Error('Error signing in');
        }
    }

    generateToken(user) {
        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '10h', // Token expires in 1 hour
        });

        return token;
    }
}

module.exports = new AuthService();
