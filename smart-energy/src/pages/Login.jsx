import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      let errorMsg = "Invalid email or password";

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await res.json();
            errorMsg = data.message || errorMsg;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
        }
        throw new Error(errorMsg);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const data = await res.json();
          // OTP sent to email - show OTP input on same page
          setOtpSent(true);
        } catch (e) {
          console.error("Error parsing success response:", e);
          throw new Error("An unexpected error occurred");
        }
      }

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      let errorMsg = "Invalid or expired OTP";

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await res.json();
            errorMsg = data.message || errorMsg;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
        }
        throw new Error(errorMsg);
      }

      const contentType = res.headers.get("content-type");
      let token = null;
      if (contentType && contentType.includes("application/json")) {
        try {
          const data = await res.json();
          token = data.token;
          console.log("OTP verified successfully. Token received:", token ? "Yes" : "No");
        } catch (e) {
          console.error("Error parsing success response:", e);
          throw new Error("An unexpected error occurred");
        }
      }

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage. Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        throw new Error("No token received from server");
      }

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="auth-page">
      <div style={{ position: "fixed", top: "16px", right: "20px", zIndex: 999 }}>
        <ThemeToggle />
      </div>
      <div className="hero">
        <div className="hero-left">

          <h1>Welcome Back</h1>
          <p>Login to continue managing your energy</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={otpSent ? handleOtpSubmit : handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={otpSent}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={otpSent}
              required
            />

            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            )}

            <button className="auth-btn">
              {otpSent ? "Verify OTP" : "Login"}</button>

            {otpSent && (
              <button 
                type="button"
                className="auth-btn-secondary"
                onClick={() => setOtpSent(false)}
              >
                Back to Login
              </button>
            )}
          </form>

          {!otpSent && (
            <>
              <p className="auth-toggle">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>

              <p className="auth-toggle">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}