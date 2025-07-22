import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Loader from "../../Common/Loader";
import Message from "../../Common/Message";
import { useLoginMutation } from "../../../redux/api/usersApiSlice";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ phone, password }).unwrap();
      console.log("akjg,ali", res);
      navigate(`/callback?token=${res.token}&isAdmin=${res.isAdmin}`);
    } catch (err) {
      alert(err?.data?.error || err.error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          {error && (
            <Message variant="danger">
              {error?.data?.error || error.error}
            </Message>
          )}
          <h2 className="title">Login</h2>
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
            <div className="auth-footer">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
              <button
                type="submit"
                className="btn-customized"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Login"}
              </button>
            </div>
          </form>
          <div className="auth-switch">
            Don't have an account? <Link to="/sign-up">Sign Up</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
