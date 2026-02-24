import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // OTP expires after 10 minutes (600 seconds)
    }
});

// Since we are using standard ES modules and Vercel/Serverless
// We check if the model is already compiled to avoid re-compilation errors
const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

export default OTP;
