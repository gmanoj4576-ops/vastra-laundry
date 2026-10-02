package com.vastra.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:noreply@vastralaundry.com}")
    private String fromEmail;

    public boolean sendOtpEmail(String toEmail, String otpCode) {
        if (mailSender == null) {
            System.out.println("⚠️ [EMAIL SERVICE] JavaMailSender is not configured. Skipping live email send.");
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Vastra Laundry - Verification Code");
            message.setText("Hello,\n\nYour 6-digit verification code for Vastra Laundry is: " + otpCode + "\n\nThis code is valid for 10 minutes.\n\nRegards,\nVastra Laundry Team");

            mailSender.send(message);
            System.out.println("✅ [EMAIL SERVICE] Successfully sent OTP email to " + toEmail);
            return true;
        } catch (Exception e) {
            System.err.println("⚠️ [EMAIL SERVICE] Failed to send email to " + toEmail + ": " + e.getMessage());
            return false;
        }
    }
}
