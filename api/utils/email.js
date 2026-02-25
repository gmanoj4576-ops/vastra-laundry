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

export const sendOrderReceivedEmail = async (email, order) => {
    const orderIdShort = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
    const qrData = `ORD-${orderIdShort}|${order.totalAmount}|${order.items.length} items`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const mailOptions = {
        from: `"Vastra Laundry" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Received - #${orderIdShort}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #10b981; margin: 0; font-size: 28px;">Vastra Laundry</h1>
                    <p style="color: #64748b; margin: 5px 0;">Order Successfully Picked Up</p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Order Details</h3>
                    <p><strong>Order ID:</strong> #${orderIdShort}</p>
                    <p><strong>Tracking ID:</strong> <span style="color: #4f46e5; font-family: monospace; font-weight: bold; background: #eef2ff; padding: 2px 6px; border-radius: 4px;">${order.trackingId || 'N/A'}</span></p>
                    <p><strong>Items:</strong> ${order.items.map(i => i.itemName).join(', ')}</p>
                    <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                </div>
 
                <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 12px; border: 2px dashed #10b981;">
                    <p style="margin-bottom: 15px; font-weight: bold; color: #065f46;">Scan this QR for Order Verification</p>
                    <img src="${qrCodeUrl}" alt="Order QR Code" style="width: 150px; height: 150px; border: 4px solid white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                </div>
 
                <p style="font-size: 14px; color: #64748b; margin-top: 25px; text-align: center;">
                    You can track your delivery agent live using your Tracking ID in the Vastra App.
                </p>
                
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 25px 0;">
                <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 Vastra Premium Laundry Service</p>
            </div>
        `
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('------------------------------------');
        console.log(`MOCK QR EMAIL SENT TO: ${email}`);
        console.log(`QR DATA: ${qrData}`);
        console.log('------------------------------------');
        return true;
    }

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('QR Email send error:', error);
        return false;
    }
};
