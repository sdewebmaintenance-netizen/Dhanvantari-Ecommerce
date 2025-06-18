import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Message from "../../Common/Message";
import Loader from "../../Common/Loader";
import { useSignupMutation } from "../../../redux/api/usersApiSlice";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(""); 

  const navigate = useNavigate();
  const [Signup, { isLoading, error }] = useSignupMutation();

  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError(""); 

    if (!validatePassword(password)) {
      setLocalError(
        "Password must be at least 8 characters with uppercase, lowercase, number and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      const res = await Signup({ phone, password }).unwrap();
      console.log("Signup Success:", res);
      navigate(`/callback?token=${res.token}&isAdmin=${res.isAdmin}`);
    } catch (err) {
      console.log(err?.data?.error);
    }
  };


  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="title">Sign Up</h2>

          {localError && <Message variant="danger">{localError}</Message>}
          {error && (
            <Message variant="danger">
              {error?.data?.error}
            </Message>
          )}

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
                Password must be at least 8 characters with uppercase,
                lowercase, number and special character
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
            <button
              type="submit"
              className="btn-customized"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;
