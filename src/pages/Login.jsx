import { useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import "../Styles/Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showPopup("error", "Enter email & password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://locallynk-production.up.railway.app/user/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showPopup("success", "Login successful ✅");

      setTimeout(() => window.location.href = "/", 1500);

    } catch (err) {
      showPopup("error", err.response?.data?.msg || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN / SIGNUP
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // Try logging in with google email
      const res = await axios.post(
        "https://locallynk-production.up.railway.app/user/login",
        {
          email: decoded.email,
          password: decoded.sub // Google unique ID used as password
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showPopup("success", "Google Login successful ✅");

      setTimeout(() => window.location.href = "/", 1500);

    } catch (_) {
      showPopup("error", "Google account not found. Please signup first!");
    }
  };

  return (
    <div className="signup-container">

      <form onSubmit={handleSubmit} className="signup-box">
        <h2 className="signup-title">Login</h2>

        <input
          type="email"
          placeholder="Email *"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password *"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* GOOGLE LOGIN */}
      <div className="google-wrapper">
        <p>Or</p>
        <div className="google-btn">
          <GoogleLogin
            theme="filled_blue"
            size="large"
            onSuccess={handleGoogleLogin}
            onError={() => showPopup("error", "Google Login Failed")}
          />
        </div>
      </div>

      {popup.show && <Notification type={popup.type} message={popup.message} />}

    </div>
  );
};

export default Login;
