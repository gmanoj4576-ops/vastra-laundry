import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // Optional email
    password: { type: String }, // Optional password
    role: { type: String, enum: ['customer', 'admin', 'partner', 'logistics'], default: 'customer' },
    walletBalance: { type: Number, default: 0 },
    vastraCoins: { type: Number, default: 0 },
    lastCheckinDate: { type: String }, // format: 'YYYY-MM-DD'
    savedAddresses: [{
        type: { type: String },
        text: String
    }],
    notifications: [{
        text: String,
        date: String,
        read: { type: Boolean, default: false }
    }],
    dailyEarnings: { type: Number, default: 0 }, // For logistics/partners
    partnerStatus: { type: String, enum: ['active', 'inactive'], default: 'active' },
    logisticsStatus: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
