package com.smartenergy.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.email.from:noreply@smartenergy.com}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {
        try {
            if (mailSender == null) {
                // In development mode, log OTP instead of sending
                log.warn("═════════════════════════════════════════");
                log.warn("📧 Mail service not configured!");
                log.warn("🔐 OTP for {}: {}", toEmail, otp);
                log.warn("═════════════════════════════════════════");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Smart Energy - Login Verification Code");
            message.setText(buildOtpEmailBody(otp));
            message.setFrom(fromEmail);

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);
        } catch (Exception e) {
            // In development, log the OTP for testing purposes
            log.warn("═════════════════════════════════════════");
            log.warn("⚠️ Failed to send OTP email.");
            log.warn("🔐 OTP for {}: {}", toEmail, otp);
            log.warn("═════════════════════════════════════════");
            log.debug("Exception details:", e);
        }
    }

    public void sendPasswordResetOtp(String toEmail, String otp) {
        try {
            if (mailSender == null) {
                // In development mode, log OTP instead of sending
                log.warn("═════════════════════════════════════════");
                log.warn("📧 Mail service not configured!");
                log.warn("🔐 Password Reset OTP for {}: {}", toEmail, otp);
                log.warn("═════════════════════════════════════════");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Smart Energy - Password Reset Verification Code");
            message.setText(buildPasswordResetEmailBody(otp));
            message.setFrom(fromEmail);

            mailSender.send(message);
            log.info("Password reset OTP email sent to: {}", toEmail);
        } catch (Exception e) {
            // In development, log the OTP for testing purposes
            log.warn("═════════════════════════════════════════");
            log.warn("⚠️ Failed to send password reset OTP email.");
            log.warn("🔐 Password Reset OTP for {}: {}", toEmail, otp);
            log.warn("═════════════════════════════════════════");
            log.debug("Exception details:", e);
        }
    }

    private String buildOtpEmailBody(String otp) {
        return String.format("""
                Dear User,
                
                Your Smart Energy login verification code is:
                
                %s
                
                This code is valid for 5 minutes. Do not share this code with anyone.
                
                If you did not request this code, please ignore this email.
                
                Best regards,
                Smart Energy Team
                """, otp);
    }

    private String buildPasswordResetEmailBody(String otp) {
        return String.format("""
                Dear User,
                
                Your Smart Energy password reset verification code is:
                
                %s
                
                This code is valid for 5 minutes. Do not share this code with anyone.
                
                If you did not request a password reset, please ignore this email.
                
                Best regards,
                Smart Energy Team
                """, otp);
    }
}

