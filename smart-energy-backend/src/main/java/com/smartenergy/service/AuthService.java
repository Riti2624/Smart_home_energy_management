package com.smartenergy.service;

import com.smartenergy.dto.*;
import com.smartenergy.entity.User;
import com.smartenergy.exception.InvalidCredentialsException;
import com.smartenergy.exception.InvalidOtpException;
import com.smartenergy.exception.ResourceNotFoundException;
import com.smartenergy.exception.UserAlreadyExistsException;
import com.smartenergy.repository.UserRepository;
import com.smartenergy.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final Random random = new Random();

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Processing signup for email: {}", request.getEmail());

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCredentialsException("Passwords do not match");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        try {
            // Create new user
            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .otp(null)
                    .otpExpiry(null)
                    .build();

            User savedUser = userRepository.save(user);
            log.info("User registered successfully: {}", savedUser.getEmail());

            return AuthResponse.builder()
                    .success(true)
                    .message("Signup successful. Please login. OTP is required only for login.")
                    .email(savedUser.getEmail())
                    .build();
        } catch (Exception e) {
            log.error("Error during signup", e);
            throw new RuntimeException("Signup failed: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Generate OTP
        String otp = generateOtp();
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        user.setOtp(passwordEncoder.encode(otp));
        user.setOtpExpiry(otpExpiry);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        try {
            // Send OTP via email
            emailService.sendOtp(user.getEmail(), otp);
            log.info("OTP sent to email: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send OTP email", e);
            throw new RuntimeException("Failed to send OTP. Please try again.");
        }

        return AuthResponse.builder()
                .success(true)
                .message("OTP sent to your email. Please verify to complete login.")
                .email(user.getEmail())
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(OtpVerificationRequest request) {
        log.info("Processing OTP verification for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        // Validate OTP existence
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            throw new InvalidOtpException("OTP not found. Please login again.");
        }

        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            user.setOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new InvalidOtpException("OTP has expired. Please login again.");
        }

        // Verify OTP
        if (!passwordEncoder.matches(request.getOtp(), user.getOtp())) {
            throw new InvalidOtpException("Invalid OTP. Please try again.");
        }

        // Clear OTP
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());
        log.info("JWT token generated for user: {}", user.getEmail());

        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .email(user.getEmail())
                .token(token)
                .expiresIn(jwtExpirationMs / 1000)
                .build();
    }

    @Transactional
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        log.info("Processing forgot password for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        // Generate OTP
        String otp = generateOtp();
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        user.setOtp(passwordEncoder.encode(otp));
        user.setOtpExpiry(otpExpiry);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        try {
            // Send OTP via email
            emailService.sendPasswordResetOtp(user.getEmail(), otp);
            log.info("Password reset OTP sent to email: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send OTP email for password reset", e);
            throw new RuntimeException("Failed to send OTP. Please try again.");
        }

        return AuthResponse.builder()
                .success(true)
                .message("OTP sent to your email. Please verify to reset your password.")
                .email(user.getEmail())
                .build();
    }

    @Transactional
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        log.info("Processing password reset for email: {}", request.getEmail());

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCredentialsException("Passwords do not match");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        // Validate OTP existence
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            throw new InvalidOtpException("OTP not found. Please request a new one.");
        }

        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            user.setOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new InvalidOtpException("OTP has expired. Please request a new one.");
        }

        // Verify OTP
        if (!passwordEncoder.matches(request.getOtp(), user.getOtp())) {
            throw new InvalidOtpException("Invalid OTP. Please try again.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Password reset successful for user: {}", user.getEmail());

        return AuthResponse.builder()
                .success(true)
                .message("Password reset successful. Please login with your new password.")
                .email(user.getEmail())
                .build();
    }

    private String generateOtp() {
        return String.format("%06d", random.nextInt(1000000));
    }
}
