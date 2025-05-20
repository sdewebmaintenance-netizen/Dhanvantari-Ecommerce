import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const isAdmin = params.get("isAdmin")

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin);
      navigate("/home"); 
    } else {
      console.error("Token not found in URL");
      alert("Login failed or token missing");
    }
  }, [navigate]);

  return <div>Signing in, please wait...</div>;
};

export default GoogleCallback;
