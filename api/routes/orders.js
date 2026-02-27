import express from 'express';
import Order from '../models/Order.js';
import { sendOrderReceivedEmail } from '../utils/email.js';

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
    console.log('📥 Incoming Order Request:', req.body);
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        console.log('✅ Order Saved to DB:', newOrder._id);
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('❌ Order Save Failed:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Get User Orders (Identifier can be Email or Mobile)
router.get('/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;
        const query = {
            $or: [
                { userEmail: identifier },
                { userMobile: identifier }
            ]
        };

        // Also check with +91 if it's 10 digits
        if (/^\d{10}$/.test(identifier)) {
            query.$or.push({ userMobile: `+91${identifier}` });
        } else if (/^\+91\d{10}$/.test(identifier)) {
            query.$or.push({ userMobile: identifier.replace('+91', '') });
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
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

// Bulk Assign Orders (Admin)
router.put('/bulk/assign', async (req, res) => {
    console.log('📦 Bulk Assign Request:', req.body.orderIds?.length, 'orders for agent', req.body.partnerId);
    try {
        const { orderIds, partnerId } = req.body;
        if (!orderIds || !Array.isArray(orderIds) || !partnerId) {
            return res.status(400).json({ message: 'Invalid request data' });
        }
        const result = await Order.updateMany(
            { _id: { $in: orderIds } },
            { assignedPartner: partnerId, deliveryAgent: partnerId, status: 'Assigned' }
        );
        res.json({ message: 'Orders assigned successfully', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assign Order to Partner (Admin)
router.put('/:id/assign', async (req, res) => {
    console.log('📦 Single Assign Request for ID:', req.params.id, 'to agent', req.body.partnerId);
    try {
        const { partnerId } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { assignedPartner: partnerId, deliveryAgent: partnerId, status: 'Assigned' },
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

        // Generate trackingId and trigger Email if status is "Order Received"
        if (status === 'Order Received') {
            const trackingId = `VST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            console.log('📬 Order Received - Generating Tracking ID:', trackingId);

            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                { status, trackingId },
                { new: true }
            );

            sendOrderReceivedEmail(updatedOrder.userEmail, updatedOrder).catch(err => console.error('Email trigger failed:', err));
            return res.json(updatedOrder);
        }

        const orderResult = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(orderResult);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Order Location (Partner)
router.put('/:id/location', async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                currentLocation: {
                    lat,
                    lng,
                    updatedAt: Date.now()
                }
            },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Order by Tracking ID
router.get('/tracking/:trackingId', async (req, res) => {
    try {
        const order = await Order.findOne({ trackingId: req.params.trackingId });
        if (!order) return res.status(404).json({ message: 'Tracking ID not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Orders for specific Logistics Agent (formerly Partner)
router.get('/logistics/:agentId', async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ assignedPartner: req.params.agentId }, { deliveryAgent: req.params.agentId }]
        }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Backward compatibility
router.get('/partner/:partnerId', async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ assignedPartner: req.params.partnerId }, { deliveryAgent: req.params.partnerId }]
        }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
