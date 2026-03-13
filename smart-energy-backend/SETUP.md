# Smart Energy Backend - Installation & Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- ✅ Java 17+ (check with `java -version`)
- ✅ MySQL 8+ (check with `mysql --version`)
- ✅ Maven 3.6+ (check with `mvn --version`)

### Step 1: Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the setup script
mysql -u root -p < database-setup.sql
```

Or directly in MySQL client:

```sql
CREATE DATABASE smart_energy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure Application

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  
  mail:
    host: ${SPRING_MAIL_HOST:smtp.gmail.com}
    port: ${SPRING_MAIL_PORT:587}
    username: ${EMAIL_USER}
    password: ${EMAIL_PASS}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}
```

### Step 3: Build & Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Server starts at: `http://localhost:8080`

---

## Detailed Configuration

### Gmail App Password Setup

1. Go to: https://myaccount.google.com/apppasswords
2. Select Mail & Windows
3. Generate app password
4. Copy and paste in `application.yml` under `spring.mail.password`

### JWT Secret Generation

Generate a strong secret:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32); [Convert]::ToBase64String($bytes)
```

Generate a Base64 encoded 256-bit secret:

```bash
echo -n "your-random-string-here-minimum-32-characters" | base64
```

### MySQL User Creation (Recommended)

Instead of using root, create a dedicated user:

```sql
CREATE USER 'smartenergy'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON smart_energy_db.* TO 'smartenergy'@'localhost';
FLUSH PRIVILEGES;
```

Update `application.yml`:
```yaml
spring:
  datasource:
    username: smartenergy
    password: secure_password_here
```

---

## IDE Setup

### VS Code

1. Install Extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Maven for Java

2. Open folder: `smart-energy-backend`

3. Maven will auto-download dependencies

### IntelliJ IDEA

1. File → Open → Select `smart-energy-backend` folder
2. Trust the project
3. IntelliJ will automatically recognize pom.xml
4. Right-click `SmartEnergyBackendApplication.java` → Run

### Eclipse

1. File → Import → Existing Maven Projects
2. Select `smart-energy-backend` folder
3. Click Finish
4. Right-click project → Run As → Spring Boot App

---

## Verify Installation

### Test Backend Health

```bash
curl http://localhost:8080/api/health
# or
curl http://localhost:8080
```

### Test Signup Endpoint

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'
```

### Check Database

```bash
mysql -u root -p smart_energy_db
SELECT * FROM users;
```

---

## Frontend Integration (React)

Update your React app to call the backend:

### 1. Create API Service

Create `src/services/authService.js`:

```javascript
const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
  signup: (email, password, confirmPassword) =>
    fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmPassword })
    }).then(r => r.json()),

  login: (email, password) =>
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  verifyOtp: (email, otp) =>
    fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    }).then(r => r.json()),

  forgotPassword: (email) =>
    fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(r => r.json()),

  resetPassword: (email, otp, password, confirmPassword) =>
    fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password, confirmPassword })
    }).then(r => r.json()),

  getAuthHeader: () => ({
    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
  })
};
```

### 2. Update Login Component

Update `src/pages/Login.jsx`:

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("login"); // login or otp

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const response = await authService.login(email, password);
    if (response.success) {
      setStep("otp");
    } else {
      setError(response.message);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");

    const response = await authService.verifyOtp(email, otp);
    if (response.success) {
      localStorage.setItem("jwt_token", response.token);
      localStorage.setItem("user_email", response.email);
      navigate("/dashboard");
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="auth-page">
      {step === "login" ? (
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          {error && <div className="error">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <Link to="/signup">Sign Up</Link>
        </form>
      ) : (
        <form onSubmit={handleOtpVerify}>
          <h1>Verify OTP</h1>
          {error && <div className="error">{error}</div>}
          <p>OTP sent to {email}</p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}
```

### 3. Protected API Calls

Use JWT token in protected endpoints:

```javascript
const fetchProtectedData = async () => {
  const response = await fetch('http://localhost:8080/api/dashboard', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  });
  return response.json();
};
```

---

## Troubleshooting

### Port 8080 Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use different port in application.yml
server:
  port: 8081
```

### MySQL Connection Refused

```bash
# Start MySQL service
# Linux
sudo systemctl start mysql

# Mac
brew services start mysql

# Windows (as Administrator)
net start MySQL80
```

### Email Not Sending

1. Verify Gmail app password is correct
2. Check logs: `Exception in thread "... JavaMailSender ..."`
3. Enable less secure apps: https://myaccount.google.com/u/0/security

### Cannot Find Java

```bash
# Set JAVA_HOME (if not set)
# Linux/Mac
export JAVA_HOME=/path/to/jdk17

# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

---

## Development Tips

### Hot Reload (Auto Restart)

```bash
# Add spring-boot-devtools (already in pom.xml)
# Changes will auto-reload when you save files
```

### Enable Debug Logging

In `application.yml`:
```yaml
logging:
  level:
    root: INFO
    com.smartenergy: DEBUG
    org.springframework.security: DEBUG
```

### View SQL Queries

In `application.yml`:
```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### Generate Sample Data

```sql
INSERT INTO users (email, password, is_active) VALUES
('user1@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXmVxWZO2w1i', TRUE),
('user2@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXmVxWZO2w1i', TRUE);
```

---

## Next Steps

1. ✅ Setup database & app configuration
2. ✅ Run backend server
3. ✅ Integrate with React frontend
4. ✅ Test API endpoints
5. ⬜ Add more protected endpoints
6. ⬜ Deploy to production
7. ⬜ Set up monitoring & logging

---

## Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT (jjwt)](https://github.com/jwtk/jjwt)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## Support

Contact: [Your Support Email]
