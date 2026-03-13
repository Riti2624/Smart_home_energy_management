# Smart Energy Backend - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Core Components](#core-components)
5. [API Documentation](#api-documentation)
6. [Configuration](#configuration)
7. [Security](#security)
8. [Development Guide](#development-guide)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Smart Energy Backend** is a production-ready Spring Boot authentication service featuring:

- ✅ User registration and login
- ✅ OTP-based authentication (6-digit codes)
- ✅ JWT token generation and validation
- ✅ Forgot password with OTP reset
- ✅ BCrypt password hashing
- ✅ Email-based OTP delivery
- ✅ CORS support for React frontend
- ✅ Global exception handling
- ✅ Comprehensive logging
- ✅ Database persistence with JPA
- ✅ Stateless session management

### Tech Stack
```
Java 17 | Spring Boot 3.2 | Spring Data JPA | Spring Security
JWT (jjwt) | BCrypt | MySQL 8 | JavaMailSender | Lombok
```

---

## 🚀 Quick Start

### Minimum Requirements
```
Java 17+
MySQL 8+
Maven 3.6+
```

### 1. Setup Database

```bash
mysql -u ${SPRING_DATASOURCE_USERNAME} -p < database-setup.sql
```

### 2. Configure Application

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

### 3. Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

Server: `http://localhost:8080`

---

## 📁 Project Structure

```
smart-energy-backend/
├── src/main/java/com/smartenergy/
│   ├── controller/
│   │   └── AuthController.java          # REST endpoints
│   ├── service/
│   │   ├── AuthService.java             # Business logic
│   │   └── EmailService.java            # Email operations
│   ├── repository/
│   │   └── UserRepository.java          # Database access
│   ├── entity/
│   │   └── User.java                    # JPA entity
│   ├── dto/
│   │   ├── SignupRequest.java
│   │   ├── LoginRequest.java
│   │   ├── OtpVerificationRequest.java
│   │   ├── ForgotPasswordRequest.java
│   │   ├── ResetPasswordRequest.java
│   │   ├── AuthResponse.java
│   │   └── UserResponse.java
│   ├── security/
│   │   ├── JwtTokenProvider.java        # JWT utilities
│   │   └── JwtAuthenticationFilter.java # Security filter
│   ├── config/
│   │   ├── SecurityConfig.java          # Spring Security
│   │   └── WebConfig.java               # Web configuration
│   ├── exception/
│   │   ├── ResourceNotFoundException.java
│   │   ├── InvalidCredentialsException.java
│   │   ├── InvalidOtpException.java
│   │   ├── UserAlreadyExistsException.java
│   │   ├── ErrorResponse.java
│   │   └── GlobalExceptionHandler.java  # Error handling
│   └── SmartEnergyBackendApplication.java
├── src/main/resources/
│   └── application.yml                  # Configuration
├── pom.xml                              # Maven dependencies
├── database-setup.sql                   # Database schema
├── README.md                            # Overview
├── SETUP.md                             # Installation guide
├── API_TESTING.md                       # API examples
├── DEPLOYMENT.md                        # Production guide
└── application-example.yml              # Config template
```

---

## 🔧 Core Components

### 1. Entity Layer

**User.java**
```java
- id (Long)
- email (String, unique)
- password (String, BCrypt hashed)
- otp (String, BCrypt hashed)
- otpExpiry (LocalDateTime)
- createdAt (LocalDateTime, auto)
- updatedAt (LocalDateTime)
- isActive (Boolean)
```

### 2. DTO Layer

**Request DTOs:**
- `SignupRequest`: email, password, confirmPassword
- `LoginRequest`: email, password
- `OtpVerificationRequest`: email, otp
- `ForgotPasswordRequest`: email
- `ResetPasswordRequest`: email, otp, password, confirmPassword

**Response DTOs:**
- `AuthResponse`: message, email, token, expiresIn, success
- `UserResponse`: id, email, createdAt

### 3. Service Layer

**AuthService:**
- `signup()`: Register new user with BCrypt hashing
- `login()`: Generate and email 6-digit OTP
- `verifyOtp()`: Validate OTP and generate JWT
- `forgotPassword()`: Send password reset OTP
- `resetPassword()`: Update password after OTP verification

**EmailService:**
- `sendOtp()`: Send login OTP
- `sendPasswordResetOtp()`: Send password reset OTP

### 4. Security Layer

**JwtTokenProvider:**
- `generateToken()`: Create JWT with email as subject
- `validateToken()`: Verify signature and expiration
- `getEmailFromToken()`: Extract email claim
- `isTokenExpired()`: Check expiration

**JwtAuthenticationFilter:**
- Intercepts requests and extracts JWT from Authorization header
- Validates token and sets authentication context
- Runs before Spring Security filters

### 5. Controller Layer

**AuthController:**
- `POST /auth/signup`: Register user
- `POST /auth/login`: Request OTP
- `POST /auth/verify-otp`: Verify OTP and get JWT
- `POST /auth/forgot-password`: Request password reset OTP
- `POST /auth/reset-password`: Reset password with OTP

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### 1. Signup (Register)

```http
POST /auth/signup
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

Response (201):
{
  "success": true,
  "message": "Signup successful. Please login to continue.",
  "email": "user@example.com"
}

Error (409):
{
  "message": "Email already registered",
  "error": "USER_ALREADY_EXISTS",
  "status": 409
}
```

### 2. Login (Request OTP)

```http
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to your email",
  "email": "user@example.com"
}

Error (401):
{
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS",
  "status": 401
}
```

### 3. Verify OTP (Get JWT)

```http
POST /auth/verify-otp
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA4NjMyMjU0LCJleHAiOjE3MDg3MTg2NTR9.xxx",
  "expiresIn": 86400
}

Error (400):
{
  "message": "Invalid OTP",
  "error": "INVALID_OTP",
  "status": 400
}
```

### 4. Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

Request:
{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to your email",
  "email": "user@example.com"
}
```

### 5. Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successful",
  "email": "user@example.com"
}
```

### Using JWT Token

```http
GET /protected-endpoint
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA4NjMyMjU0LCJleHAiOjE3MDg3MTg2NTR9.xxx
```

---

## ⚙️ Configuration

### Essential Settings

**application.yml:**
```yaml
spring:
  # Database
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  
  # Email
  mail:
    host: ${SPRING_MAIL_HOST}
    port: ${SPRING_MAIL_PORT}
    username: ${EMAIL_USER}
    password: ${EMAIL_PASS}
  
  # JPA
  jpa:
    hibernate:
      ddl-auto: update  # validate in production
    show-sql: true

# JWT
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}

server:
  port: 8080
```

### Gmail App Password

1. Enable 2FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use in `spring.mail.password`

### Environment Variables (Production)

```bash
export DB_URL=jdbc:mysql://production-host:3306/smart_energy_db
export DB_USERNAME=db_username
export DB_PASSWORD=strong_password
export JWT_SECRET=your-256bit-secret
export MAIL_USERNAME=noreply@smartenergy.com
export MAIL_PASSWORD=app-password
```

---

## 🔐 Security

### Password Security
- **Algorithm**: BCrypt with 10 salt rounds
- **Hashing**: All passwords hashed before storage
- **Verification**: Spring Security's passwordEncoder

### OTP Security
- **Format**: 6-digit random number
- **Validity**: 5 minutes
- **Storage**: BCrypt hashed
- **Uniqueness**: Not validated against previous OTPs

### JWT Security
- **Algorithm**: HS512 (HMAC with SHA-512)
- **Secret**: Minimum 256-bit key recommended
- **Expiration**: 24 hours (configurable)
- **Claims**: Email (sub), Issued At (iat), Expiration (exp)

### CORS Security
```java
CORS enabled for all endpoints
Allowed credentials: true
Allowed origins: * (configure for production)
Allowed methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

### Best Practices
1. ✅ Always use HTTPS in production
2. ✅ Change JWT secret from default
3. ✅ Use strong database passwords
4. ✅ Enable MySQL SSL
5. ✅ Implement rate limiting
6. ✅ Add CAPTCHA for failed attempts
7. ✅ Monitor suspicious activities
8. ✅ Implement request validation
9. ✅ Use secure email service
10. ✅ Regular security audits

---

## 👨‍💻 Development Guide

### IDE Setup

**VS Code:**
```bash
- Install "Extension Pack for Java"
- Install "Spring Boot Extension Pack"
- Add Java 17 JDK to system path
```

**IntelliJ IDEA:**
```bash
- File > Open > Select folder
- IDEA auto-configures Maven
- Right-click > Run Application
```

### Building & Running

```bash
# Build only
mvn clean install

# Run with Maven
mvn spring-boot:run

# Run JAR
java -jar target/smart-energy-backend-1.0.0.jar

# Run with profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Testing API Endpoints

```bash
# Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","confirmPassword":"Test@123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

### Debugging

```yaml
# Enable debug logging in application.yml
logging:
  level:
    com.smartenergy: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

### Hot Reload

Add to `pom.xml`:
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-devtools</artifactId>
  <scope>runtime</scope>
  <optional>true</optional>
</dependency>
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Security review completed
- [ ] JWT secret configured
- [ ] Database backups enabled
- [ ] Email service working
- [ ] CORS origins restricted
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Rate limiting implemented
- [ ] Logging centralized

### Docker Deployment

```bash
# Build image
docker build -t smart-energy-backend:v1.0 .

# Run container
docker run -d -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:mysql://mysql:3306/smart_energy_db \
  -e JWT_SECRET=$JWT_SECRET \
  smart-energy-backend:v1.0

# Using docker-compose
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=db-url=$DB_URL \
  --from-literal=jwt-secret=$JWT_SECRET

# Deploy
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Monitor
kubectl logs deployment/smart-energy-backend
```

### AWS Deployment

```bash
# Elastic Beanstalk
eb init
eb create smart-energy-prod
eb deploy

# RDS Database
aws rds create-db-instance --db-instance-class db.t3.micro
```

---

## 🐛 Troubleshooting

### Common Issues

**Port 8080 Already in Use**
```bash
lsof -i :8080
kill -9 <PID>
# Or change port in application.yml
```

**MySQL Connection Error**
```bash
# Check MySQL running
mysql -u root -p
# Check credentials in application.yml
# Ensure database exists
```

**Email Not Sending**
```bash
1. Verify Gmail app password
2. Enable 2FA on Gmail account
3. Check logs for SMTP errors
4. Test with: mysql> CALL test_email();
```

**JWT Token Invalid**
```bash
1. Check token expiration: jwt.io
2. Verify JWT secret matches
3. Check Authorization header format: "Bearer <token>"
4. Ensure token not modified
```

**OTP Not Received**
```bash
1. Check MySQL: SELECT * FROM users WHERE email='...';
2. Check email service logs
3. Check spam folder
4. Verify SMTP configuration
```

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Guide](https://spring.io/projects/spring-security)
- [JWT Official Guide](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Lombok Project](https://projectlombok.org/)

---

## 📞 Support

### Logging
All requests and errors are logged. Check logs in:
- Console output (development)
- `logs/smart-energy.log` (production)

### Monitoring
```bash
# Health check
curl http://localhost:8080/api/health

# Metrics
curl http://localhost:8080/api/metrics
```

### Backup & Recovery
```bash
# MySQL backup
mysqldump -u root -p smart_energy_db > backup.sql

# Restore
mysql -u root -p smart_energy_db < backup.sql
```

---

## 📄 License

This project is proprietary to Smart Energy.

---

## ✨ Features Roadmap

- [ ] Email verification on signup
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] User profile management
- [ ] Session management
- [ ] API versioning
- [ ] Rate limiting per user
- [ ] Request caching
- [ ] GraphQL support
- [ ] WebSocket support
- [ ] Microservices architecture

---

**Version**: 1.0.0  
**Last Updated**: February 2024  
**Maintained By**: Smart Energy Team
