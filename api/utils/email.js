import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async (email, otp) => {
    // If no email credentials, log the OTP for testing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('------------------------------------');
        console.log(`MOCK EMAIL SENT TO: ${email}`);
        console.log(`OTP CODE: ${otp}`);
        console.log('------------------------------------');
        return true;
    }

    const mailOptions = {
        from: `"Vastra Laundry" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Vastra Verification Code',
        html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">Vastra Laundry</h2>
                <p>Hello,</p>
                <p>Use the following code to verify your email address and complete your registration:</p>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 8px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">© 2026 Vastra Laundry Service</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        console.log('------------------------------------');
        console.log(`Bypass OTP (Copy this): ${otp}`);
        console.log('------------------------------------');
        throw new Error('Failed to send verification email. (Check terminal for bypass code)');
    }
};
