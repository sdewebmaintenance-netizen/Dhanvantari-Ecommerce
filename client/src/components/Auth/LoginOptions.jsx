import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import handleGoogleSignIn from "../../Utils/HandleGoogleSignIn";
import getImage from "../../Utils/GetImage";

const LoginOptions = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="title">Login Options</h2>
      <div className="auth-options">
        <button
          className="btn-customized "
          onClick={() => {
            handleGoogleSignIn();
          }}
        >
          <img src={getImage("Google_Logo.png","Logo")} style={{ width: "2rem", padding:"0.1rem" }} className="google-login-btn"/>
          Login with Google
        </button>
        <button
          className="btn-customized"
          onClick={() => navigate("/Login")}
        >
          Login with Phone
        </button>
      </div>
    </div>
  );
};

export default LoginOptions;
