import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userEmail: { type: String }, // Optional instead of required
    userMobile: { type: String, required: true }, // Ensure mobile is required as a baseline
    items: [{
        itemName: String,
        serviceName: String,
        price: Number,
        quantity: Number,
        isCustom: { type: Boolean, default: false },
        details: String,
        budget: String
    }],
    totalAmount: Number,
    address: { type: String },
    partnerPayout: { type: Number, default: 0 }, // Amount to be paid to partner
    assignedPartner: { type: String, default: null }, // Legacy support
    deliveryAgent: { type: String, default: null }, // Current standard
    trackingId: { type: String, unique: true, sparse: true },
    status: {
        type: String,
        enum: ['Pending', 'Order Received', 'Assigned', 'Processing', 'Washing', 'Ironing', 'Out for Delivery', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    date: { type: String, required: true },
    currentLocation: {
        lat: Number,
        lng: Number,
        updatedAt: { type: Date, default: Date.now }
    }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
