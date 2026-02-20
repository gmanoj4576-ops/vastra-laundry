import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Orders
router.get('/:email', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assign Order to Partner (Admin)
router.put('/:id/assign', async (req, res) => {
    try {
        const { partnerId, partnerPayout } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { assignedPartner: partnerId, partnerPayout, status: 'Assigned' },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Order Status (Partner/Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Orders for specific Partner
router.get('/partner/:partnerId', async (req, res) => {
    try {
        const orders = await Order.find({ assignedPartner: req.params.partnerId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
