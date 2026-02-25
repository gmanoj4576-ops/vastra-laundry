import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Admin: Manually register a new user without OTP
router.post('/register', async (req, res) => {
    try {
        const { name, mobile, email, password, role } = req.body;

        // Prevent registering another admin through this quick route just in case
        if (role === 'admin') {
            return res.status(400).json({ message: 'Cannot register a new admin via this route' });
        }

        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this mobile number already exists' });
        }

        const newUser = new User({
            name,
            mobile,
            email: email || undefined,
            password: password || '123456', // Default password if none provided
            role: role || 'customer',
            walletBalance: 0,
            vastraCoins: 0
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Forcefully update wallet balance
router.put('/users/:id/wallet', async (req, res) => {
    try {
        const { walletBalance } = req.body;

        if (typeof walletBalance !== 'number') {
            return res.status(400).json({ message: 'Invalid wallet balance amount' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { walletBalance },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Wallet balance updated', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update general user details
router.put('/users/:id', async (req, res) => {
    try {
        const { name, mobile, email, savedAddresses } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;
        if (email) updateData.email = email;
        if (savedAddresses) updateData.savedAddresses = savedAddresses;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User details updated', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
