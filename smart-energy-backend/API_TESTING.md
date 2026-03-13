# API Testing Guide

## Using cURL

### 1. Signup

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Signup successful. Please login to continue.",
  "email": "testuser@example.com"
}
```

---

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test@123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to complete login.",
  "email": "testuser@example.com"
}
```

**Check email for OTP** (or database: `SELECT otp FROM users WHERE email='testuser@example.com';`)

---

### 3. Verify OTP

```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "email": "testuser@example.com",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "expiresIn": 86400
}
```

**Save token for protected endpoints**

---

### 4. Forgot Password

```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com"
  }'
```

**OTP will be sent to email**

---

### 5. Reset Password

```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "otp": "123456",
    "password": "NewPassword@123",
    "confirmPassword": "NewPassword@123"
  }'
```

---

## Using Postman

### Import Collection

1. Open Postman
2. Create new Collection: "Smart Energy Auth"
3. Add requests as shown below

### Request: Signup
- **Method**: POST
- **URL**: `http://localhost:8080/api/auth/signup`
- **Body** (JSON):
```json
{
  "email": "postman@example.com",
  "password": "Test@123",
  "confirmPassword": "Test@123"
}
```

### Request: Login
- **Method**: POST
- **URL**: `http://localhost:8080/api/auth/login`
- **Body** (JSON):
```json
{
  "email": "postman@example.com",
  "password": "Test@123"
}
```

### Request: Verify OTP
- **Method**: POST
- **URL**: `http://localhost:8080/api/auth/verify-otp`
- **Body** (JSON):
```json
{
  "email": "postman@example.com",
  "otp": "000000"
}
```

---

## Using JavaScript Fetch API

```javascript
const API = 'http://localhost:8080/api/auth';

// Signup
async function signup(email, password) {
  const res = await fetch(`${API}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      confirmPassword: password
    })
  });
  return res.json();
}

// Login
async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// Verify OTP
async function verifyOtp(email, otp) {
  const res = await fetch(`${API}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  return res.json();
}

// Test
(async () => {
  const signupRes = await signup('js@example.com', 'Test@123');
  console.log('Signup:', signupRes);

  const loginRes = await login('js@example.com', 'Test@123');
  console.log('Login:', loginRes);

  // Get OTP from database or email
  const otpRes = await verifyOtp('js@example.com', '000000');
  console.log('OTP Verify:', otpRes);
})();
```

---

## Using Python Requests

```python
import requests
import json

API = 'http://localhost:8080/api/auth'

def signup(email, password):
    response = requests.post(
        f'{API}/signup',
        json={
            'email': email,
            'password': password,
            'confirmPassword': password
        }
    )
    return response.json()

def login(email, password):
    response = requests.post(
        f'{API}/login',
        json={'email': email, 'password': password}
    )
    return response.json()

def verify_otp(email, otp):
    response = requests.post(
        f'{API}/verify-otp',
        json={'email': email, 'otp': otp}
    )
    return response.json()

# Test
if __name__ == '__main__':
    email = 'python@example.com'
    password = 'Test@123'
    
    print('Signup:', signup(email, password))
    print('Login:', login(email, password))
    print('OTP Verify:', verify_otp(email, '000000'))
```

---

## Error Test Cases

### Invalid Email Format
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'
```

**Response (400)**:
```json
{
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "status": 400,
  "errors": {
    "email": "Invalid email format"
  }
}
```

### Password Mismatch
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "DifferentPassword"
  }'
```

### Duplicate Email
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'
```

**Response (409)**:
```json
{
  "message": "Email already registered: existing@example.com",
  "error": "USER_ALREADY_EXISTS",
  "status": 409
}
```

### Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Response (401)**:
```json
{
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS",
  "status": 401
}
```

### Expired OTP
```bash
# Wait 5 minutes then try to verify OTP
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

**Response (400)**:
```json
{
  "message": "OTP has expired. Please login again.",
  "error": "INVALID_OTP",
  "status": 400
}
```

### Invalid OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "000000"
  }'
```

**Response (400)**:
```json
{
  "message": "Invalid OTP. Please try again.",
  "error": "INVALID_OTP",
  "status": 400
}
```

---

## Access Protected Endpoints

```bash
# Using JWT Token
curl http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzA4NjMyMjU0LCJleHAiOjE3MDg3MTg2NTR9.xxx"
```

---

## Database Verification

```sql
-- Connect to MySQL
mysql -u root -p smart_energy_db

-- View all users
SELECT id, email, is_active, created_at FROM users;

-- View user with OTP
SELECT id, email, otp, otp_expiry FROM users WHERE email='test@example.com';

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Check OTP expiry
SELECT email, otp_expiry, TIMEDIFF(otp_expiry, NOW()) as time_remaining FROM users WHERE otp IS NOT NULL;
```

---

## Common Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful login, OTP verify, etc. |
| 201 | Created | Successful signup |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Invalid credentials, expired token |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Database, email service errors |

---

## Performance Testing

### Using Apache Bench

```bash
# Signup requests (concurrent)
ab -n 100 -c 10 -p data.json -T application/json http://localhost:8080/api/auth/signup

# Login requests (concurrent)
ab -n 100 -c 10 -p data.json -T application/json http://localhost:8080/api/auth/login
```

### Using JMeter

1. Open JMeter
2. Add Thread Group (100 users)
3. Add HTTP Request (POST to /api/auth/signup)
4. Run test and check results

---

## Additional Notes

- Always use HTTPS in production
- Implement rate limiting for authentication endpoints
- Monitor OTP expiry and cleanup expired tokens
- Log all authentication attempts
- Implement CAPTCHA for brute force protection
