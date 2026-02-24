import express from 'express';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../utils/email.js';

const router = express.Router();

// 1. Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (overwrites previous if exists due to same email)
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send Email
        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent successfully to ' + email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const record = await OTP.findOne({ email });
        if (!record || record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Optional: Delete OTP after verification or mark it
        // await OTP.deleteOne({ email });

        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Signup (Mobile + Password)
router.post('/signup', async (req, res) => {
    try {
        const { name, mobile, password, email, role, otpVerified } = req.body;

        // Ensure email is verified if provided (logical check)
        if (email && !otpVerified) {
            return res.status(400).json({ message: 'Email verification required' });
        }

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
            role: role || 'customer'
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { mobile, email, identifier, password } = req.body;
        const loginId = mobile || email || identifier;

        let query = {
            $or: [
                { mobile: loginId },
                { email: loginId }
            ]
        };

        // If it's a 10-digit number, also check with +91
        if (/^\d{10}$/.test(loginId)) {
            query.$or.push({ mobile: `+91${loginId}` });
        } else if (/^\+91\d{10}$/.test(loginId)) {
            // If it has +91 already, also check without it
            query.$or.push({ mobile: loginId.replace('+91', '') });
        }

        const user = await User.findOne(query);
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

// Fetch all partners (for Admin assignments)
router.get('/partners', async (req, res) => {
    try {
        const partners = await User.find({ role: 'partner' }).select('-password');
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch all users (for Admin dashboard)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Social Login (Google)
router.post('/social-login', async (req, res) => {
    try {
        const { name, email, avatar, role } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required for social login' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user for first-time Google login
            user = new User({
                name,
                email,
                avatar: avatar || undefined,
                role: role || 'customer',
                password: Math.random().toString(36).slice(-10), // Random password placeholder
                mobile: 'Google-User-' + Math.floor(Math.random() * 1000000) // Dummy mobile for schema unique constraint if exists
            });
            await user.save();
        }

        res.json({ message: 'Social login successful', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
