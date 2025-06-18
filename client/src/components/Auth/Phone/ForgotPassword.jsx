import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Message from "../../Common/Message";
import Loader from "../../Common/Loader";
import { useForgotPasswordMutation } from "../../../redux/api/usersApiSlice";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ phone, password }).unwrap();
      if (res) {
        setLocalError("");
        navigate("/login");
      } 
    } catch (err) {
      setLocalError("Failed to process request. Please try again.");
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="auth-container">
            <div className="auth-card">
              <h2 className="auth-title">Forgot Password</h2>
              {localError && <Message variant="danger">{localError}</Message>}
              {error && (
                <Message variant="danger">{error?.data?.error}</Message>
              )}
              <form onSubmit={handleSubmit}>
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
                </div>
                <button type="submit" className="btn-customized">
                  Reset Password
                </button>
              </form>
              <div className="auth-switch">
                Remember your password? <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
