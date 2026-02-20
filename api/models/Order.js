import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
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
    partnerPayout: { type: Number, default: 0 }, // Amount to be paid to partner
    assignedPartner: { type: String, default: null }, // Link to partner user
    status: {
        type: String,
        enum: ['Pending', 'Order Received', 'Assigned', 'Processing', 'Washing', 'Ironing', 'Out for Delivery', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
