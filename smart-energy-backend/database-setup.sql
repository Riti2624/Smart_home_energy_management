-- MySQL Database Setup Script for Smart Energy Backend
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS smart_energy_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smart_energy_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    otp VARCHAR(255),
    otp_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_otp_expiry (otp_expiry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add sample user (optional)
-- Password: Replace with a secure value (BCrypt encoded)
-- INSERT INTO users (email, password, is_active) 
-- VALUES ('user@example.com', '<bcrypt-password-hash>', TRUE);

-- Create index for faster lookups
CREATE INDEX idx_users_email ON users(email);
