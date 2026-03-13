# Smart Energy Backend

A production-ready Spring Boot authentication backend with JWT and OTP-based verification system.

## Architecture Overview

```
smart-energy-backend/
├── src/main/java/com/smartenergy/
│   ├── controller/          # REST API endpoints
│   ├── service/             # Business logic
│   ├── repository/          # Database access
│   ├── entity/              # JPA entities
│   ├── dto/                 # Data transfer objects
│   ├── security/            # JWT and security filters
│   ├── config/              # Spring security and web config
│   ├── exception/           # Custom exceptions & handlers
│   └── SmartEnergyBackendApplication.java
├── src/main/resources/
│   └── application.yml      # Configuration
├── pom.xml                  # Maven dependencies
└── README.md
```

## Features

✅ User Registration/Signup
✅ Login with OTP Verification
✅ JWT Token Generation and Validation
✅ Forgot Password with OTP Reset
✅ BCrypt Password Hashing
✅ Email-based OTP Delivery
✅ CORS Configuration for React Frontend
✅ Stateless Session Management
✅ Global Exception Handling
✅ Input Validation with DTOs
✅ Lombok Annotations for Clean Code

## Tech Stack

- **Java 17** - Latest LTS version
- **Spring Boot 3.2.0** - Web framework
- **Spring Data JPA** - Database ORM
- **Spring Security** - Authentication & Authorization
- **Spring Mail** - Email service
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **BCrypt** - Password hashing
- **MySQL 8** - Database
- **Lombok** - Annotations for cleaner code
- **Maven** - Dependency management

## Prerequisites

- Java 17+ installed
- MySQL 8+ running
- Maven 3.6+
- Git (optional)

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE smart_energy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the provided script:
```bash
mysql -u ${SPRING_DATASOURCE_USERNAME} -p < database-setup.sql
```

### 2. Environment Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  
  mail:
    username: ${EMAIL_USER}
    password: ${EMAIL_PASS}
    
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}
```

### 3. Gmail Configuration (for Email OTP)

1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password: https://myaccount.google.com/apppasswords
3. Use this app password in `application.yml`

### 4. Build and Run

```bash
# Navigate to project directory
cd smart-energy-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The server will start at `http://localhost:8080`

## API Endpoints

All endpoints are prefixed with `/api/auth`

### 1. **Register User**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Signup successful. Please login to continue.",
  "email": "user@example.com"
}
```

### 2. **Login (Request OTP)**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to complete login.",
  "email": "user@example.com"
}
```

### 3. **Verify OTP (Get JWT Token)**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA4NjMyMjU0LCJleHAiOjE3MDg3MTg2NTR9.xxx",
  "expiresIn": 86400
}
```

### 4. **Forgot Password (Request OTP)**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to reset your password.",
  "email": "user@example.com"
}
```

### 5. **Reset Password**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful. Please login with your new password.",
  "email": "user@example.com"
}
```

## Protected Endpoints

To access protected endpoints, include JWT token in Authorization header:

```http
GET /api/some-protected-endpoint
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA4NjMyMjU0LCJleHAiOjE3MDg3MTg2NTR9.xxx
```

## Security Features

✅ **JWT Authentication**: Stateless, token-based authentication
✅ **BCrypt Hashing**: Passwords hashed with BCrypt with 10 rounds of salt
✅ **OTP Verification**: 6-digit OTP valid for 5 minutes
✅ **CORS Enabled**: Allows React frontend communication
✅ **CSRF Protection**: Enabled by default
✅ **Session Management**: Stateless sessions
✅ **Input Validation**: All inputs validated with constraints
✅ **Exception Handling**: Centralized error handling

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  otp VARCHAR(255),
  otp_expiry DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  is_active BOOLEAN DEFAULT TRUE
);
```

## Frontend Integration (React)

Update your React `Login.jsx` to use this backend:

```jsx
const handleLogin = async (email, password) => {
  // Step 1: Login
  const loginRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  // Step 2: Verify OTP
  const otpRes = await fetch('http://localhost:8080/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: userOtp })
  });
  
  const { token } = await otpRes.json();
  localStorage.setItem('jwt_token', token);
};
```

## Project Structure

- **entity/**: JPA entities (User)
- **dto/**: Request/Response DTOs
- **repository/**: Spring Data JPA interfaces
- **service/**: Business logic (AuthService, EmailService)
- **controller/**: REST endpoints (AuthController)
- **security/**: JWT utilities and filters (JwtTokenProvider, JwtAuthenticationFilter)
- **config/**: Spring configuration (SecurityConfig, WebConfig)
- **exception/**: Custom exceptions and global exception handler

## Logging

Configured with SLF4J and Logback:
- Application logs: DEBUG level
- Spring Security: DEBUG level
- Hibernate SQL: DEBUG level
- Hibernate bindings: TRACE level

View logs in console output when running the application.

## Error Responses

All errors follow a consistent format:

```json
{
  "message": "Error description",
  "error": "ERROR_CODE",
  "status": 400,
  "timestamp": "2024-02-27T10:30:45.123456",
  "path": "/api/auth/login"
}
```

## Production Checklist

Before deploying to production:

- [ ] Change JWT secret to a strong, random value (min 256 bits)
- [ ] Update MySQL credentials
- [ ] Configure Gmail app password for email service
- [ ] Set `spring.jpa.hibernate.ddl-auto` to `validate`
- [ ] Enable HTTPS/TLS
- [ ] Configure proper CORS origins (not *)
- [ ] Set up proper logging and monitoring
- [ ] Use environment variables for sensitive config
- [ ] Enable request rate limiting
- [ ] Set appropriate JWT expiration times
- [ ] Test all endpoints thoroughly
- [ ] Set up database backups
- [ ] Configure email service for production

## Troubleshooting

### MySQL Connection Error
```
Check if MySQL is running and credentials are correct in application.yml
```

### Email Not Sending
```
1. Check Gmail app password is correct
2. Verify 2FA is enabled on Gmail account
3. Check logs for SMTP errors
4. Ensure firewall allows SMTP port 587
```

### JWT Token Errors
```
1. Verify JWT secret is set correctly
2. Check token hasn't expired
3. Ensure token format: "Bearer <token>"
4. Validate Authorization header spelling
```

## Support

For issues or questions:
1. Check logs for detailed error messages
2. Verify all prerequisites are installed
3. Review configuration in application.yml
4. Check database connectivity

## License

This project is part of Smart Energy application.

## Author

Senior Java Spring Boot Engineer
