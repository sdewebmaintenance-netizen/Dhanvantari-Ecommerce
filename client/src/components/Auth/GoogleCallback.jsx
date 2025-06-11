import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const GoogleCallback = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const isAdmin = params.get("isAdmin");
    const isAdminBool = isAdmin === "true";

    if (token) {
      dispatch(setCredentials(token));
      localStorage.setItem("isAdmin", isAdmin);

      if (isAdminBool) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } else {
      console.error("Token not found in URL");
      alert("Login failed or token missing");
    }
  }, [navigate]);

  return <div>Signing in, please wait...</div>;
};

export default GoogleCallback;
