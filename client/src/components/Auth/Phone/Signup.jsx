import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (showOtp && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtp, timer]);

  useEffect(() => {
    const savedTimer = localStorage.getItem("otpTimer");
    if (savedTimer) {
      const remaining = parseInt(savedTimer, 10);
      if (remaining > 0) {
        setShowOtp(true);
        setTimer(remaining);
      } else {
        localStorage.removeItem("otpTimer");
      }
    }

    const handleBeforeUnload = () => {
      if (showOtp && timer > 0) {
        localStorage.setItem("otpTimer", timer.toString());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, number and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call backend to send OTP
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        setShowOtp(true);
        setTimer(60);
        setSuccess("OTP sent successfully!");
        setError("");
      } else {
        setError("Failed to send OTP");
      }
    } catch (err) {
      setError("Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, password }),
      });

      if (response.ok) {
        localStorage.removeItem("otpTimer");
        navigate("/");
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError("Error verifying OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        setTimer(60);
        setSuccess("OTP resent successfully!");
        setError("");
      } else {
        setError("Failed to resend OTP");
      }
    } catch (err) {
      setError("Error resending OTP");
    }
  };

  return (
    <div>
      <h2 className="title">Sign Up</h2>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      {!showOtp ? (
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={phone}
              onChange={setPhone}
               className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
               className="form-control"
            />
            <small className="password-hint">
              Password must be at least 8 characters with uppercase, lowercase,
              number and special character
            </small>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
               className="form-control"
            />
          </div>
          <button type="submit" className="btn-customized">
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
                className="form-control"
            />
          </div>
          <div className="otp-timer">
            {timer > 0 ? (
              <span>Time remaining: {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="resend-btn"
              >
                Resend OTP
              </button>
            )}
          </div>
          <button type="submit" className="btn-customized">
            Verify OTP
          </button>
        </form>
      )}
      <div className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
