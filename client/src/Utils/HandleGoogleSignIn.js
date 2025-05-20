import { BASE_URL } from "../config/config";

const handleGoogleSignIn = () => {
  if (!BASE_URL) {
    console.error("Backend URL is not set in environment variables.");
    alert("Configuration error: Backend URL is missing.");
    return;
  }
  try {
    window.location.href = `${BASE_URL}/auth/google`;
  } catch (error) {
    console.error("Error redirecting to Google Sign-In:", error);
    alert("Failed to redirect to Google authentication.");
  }
};

export default handleGoogleSignIn;