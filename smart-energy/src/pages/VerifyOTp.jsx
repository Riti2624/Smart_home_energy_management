import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          otp
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired OTP");
      }

      // Save JWT token to localStorage
      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Verify OTP</h2>

      {error && <div className="auth-error">{error}</div>}

      <input
        placeholder="Enter OTP"
        onChange={e => setOtp(e.target.value)}
        required
      />

      <button className="auth-btn">Verify</button>
    </form>
  );
}