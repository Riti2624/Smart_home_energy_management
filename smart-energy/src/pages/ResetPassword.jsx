import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Ensure we have email and otp from previous flow
  const email = state?.email || "";
  const otp = state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if navigated directly without proper state
  if (!email || !otp) {
    return (
      <div className="auth-page">
        <div style={{ position: "fixed", top: "16px", right: "20px", zIndex: 999 }}>
          <ThemeToggle />
        </div>
        <div className="hero">
          <div className="hero-left">
            <h1>Invalid Request</h1>
            <p>Please use the forgot password flow to reset your password.</p>
            <Link to="/forgot-password" className="auth-btn" style={{ display: "inline-block", marginTop: "20px" }}>
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, confirmPassword })
      });

      let errorMsg = "Failed to reset password";

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
            setSuccess(true);
            setPassword("");
            setConfirmPassword("");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
              navigate("/login");
            }, 2000);
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

  if (success) {
    return (
      <div className="auth-page">
        <div className="hero">
          <div className="hero-left">
            <h1>Success!</h1>
            <p>Your password has been reset successfully.</p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "20px" }}>
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div style={{ position: "fixed", top: "16px", right: "20px", zIndex: 999 }}>
        <ThemeToggle />
      </div>
      <div className="hero">
        <div className="hero-left">

          <h1>Reset Password</h1>
          <p>Enter your new password</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Password must be at least 6 characters long
            </p>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button className="auth-btn" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>

          </form>

          <p className="auth-toggle">
            <Link to="/login">Back to Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
