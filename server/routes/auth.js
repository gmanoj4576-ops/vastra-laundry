import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Signup (Mobile + Password)
router.post('/signup', async (req, res) => {
    try {
        const { name, mobile, password, email } = req.body;

        // Check if mobile already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this mobile number already exists' });
        }

        const newUser = new User({
            name,
            mobile,
            password,
            email: email || undefined,
            role: 'customer'
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Signin (Mobile + Password)
router.post('/signin', async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
