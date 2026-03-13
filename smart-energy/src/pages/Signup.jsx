import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    energyType: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (Object.values(form).some(v => v.trim() === "")) {
      return setError("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword
        })
      });

      console.log("Signup response status:", res.status, res.ok);

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMsg = "Signup failed";
        
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        }
        
        console.error("Signup error:", { status: res.status, errorMsg });
        throw new Error(errorMsg);
      }

      // Signup success should proceed to login (OTP is only for login flow)
      navigate("/login");

    } catch (err) {
      console.error("Signup exception:", err);
      setError(err.message);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp })
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMsg = "Invalid or expired OTP";
        
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        }
        
        throw new Error(errorMsg);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        // Save JWT and redirect
        localStorage.setItem("token", data.token);
      }

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div style={{ position: "fixed", top: "16px", right: "20px", zIndex: 999 }}>
        <ThemeToggle />
      </div>
      <div className="hero">
        <div className="hero-left">

          <h1>Create Account</h1>
          <p>Start managing smart renewable energy today</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={otpSent ? handleOtpSubmit : handleSubmit}>
            <input name="firstName" placeholder="First Name" onChange={handleChange} disabled={otpSent} />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} disabled={otpSent} />
            <input name="address" placeholder="Address" onChange={handleChange} disabled={otpSent} />

            <select name="energyType" onChange={handleChange} disabled={otpSent}>
              <option value="">Energy Type</option>
              <option value="Solar">Solar</option>
              <option value="Wind">Wind</option>
              <option value="Hydro">Hydro</option>
            </select>

            <input name="phone" placeholder="Phone Number" onChange={handleChange} disabled={otpSent} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} disabled={otpSent} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} disabled={otpSent} />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} disabled={otpSent} />

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
              {otpSent ? "Verify OTP" : "Sign Up"}
            </button>
          </form>

          {!otpSent && (
            <p className="auth-toggle">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}