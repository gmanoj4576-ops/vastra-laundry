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
    status: {
        type: String,
        enum: ['Order Received', 'Processing', 'Out for Delivery', 'Completed', 'Cancelled'],
        default: 'Order Received'
    },
    date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
