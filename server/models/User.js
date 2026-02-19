import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // Optional email
    password: { type: String }, // Optional password
    role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
    walletBalance: { type: Number, default: 0 },
    vastraCoins: { type: Number, default: 0 },
    savedAddresses: [{
        type: { type: String },
        text: String
    }],
    notifications: [{
        text: String,
        date: String,
        read: { type: Boolean, default: false }
    }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
