import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      let errorMsg = "Failed to send OTP";

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
          if (data.success) {
            setOtpSent(true);
          } else {
            throw new Error(data.message || errorMsg);
          }
        } catch (e) {
          console.error("Error parsing success response:", e);
          throw new Error("An unexpected error occurred");
        }
      }

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      // Navigate to reset password page with email and otp
      navigate("/reset-password", { 
        state: { email, otp } 
      });

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div style={{ position: "fixed", top: "16px", right: "20px", zIndex: 999 }}>
        <ThemeToggle />
      </div>
      <div className="hero">
        <div className="hero-left">

          <h1>Forgot Password?</h1>
          <p>Reset your password securely</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={otpSent ? handleOtpSubmit : handleEmailSubmit}>
            
            {!otpSent ? (
              <>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                  Enter your email address and we'll send you a verification code.
                </p>
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                  Enter the 6-digit code sent to <strong>{email}</strong>
                </p>
                
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  maxLength="6"
                  required
                  disabled={loading}
                />
              </>
            )}

            <button className="auth-btn" disabled={loading}>
              {loading ? "Please wait..." : (otpSent ? "Verify Code" : "Send Code")}
            </button>

            {otpSent && (
              <button 
                type="button"
                className="auth-btn-secondary"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                }}
                disabled={loading}
              >
                Back
              </button>
            )}

          </form>

          <p className="auth-toggle">
            Remember your password? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
