import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import "../Styles/Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Signup = () => {

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [googleData, setGoogleData] = useState(null);

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 10000);
  };

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    profilePic: null,
    latitude: "",
    longitude: "",
  });

  // 📍 GPS Auto-detection
  useEffect(() => {
    if (!navigator.geolocation) {
      showPopup("error", "Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => showPopup("error", "Location permission denied")
    );
  }, []);

  // ✅ INPUT HANDLING
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) =>
    setFormData((prev) => ({ ...prev, profilePic: e.target.files[0] }));

  // ✅ NORMAL + GOOGLE SIGNUP SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.password || !formData.address || !formData.city) {
      showPopup("error", "All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("userName", formData.userName);
      data.append("email", formData.email);
      data.append("password", formData.password);

      data.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [
            Number(formData.longitude),
            Number(formData.latitude),
          ],
          address: formData.address,
          city: formData.city,
        })
      );

      if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      await axios.post(
        "https://locallynk.onrender.com/user/signup",
        data
      );

      showPopup("success", "Signup Successful ✅");
      setTimeout(() => window.location.href = "/login", 1500);

    } catch (err) {
      console.error(err);
      showPopup("error", err.response?.data?.msg || "Signup Failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE DETECTOR (NO API CALL HERE)
  const handleGoogleSignup = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    setGoogleData(decoded);

    setFormData((prev) => ({
      ...prev,
      userName: decoded.name,
      email: decoded.email,
      password: decoded.sub,
      profilePic: decoded.picture
    }));

    showPopup("success", "Google detected ✅ Fill Address & City to continue");
  };

  return (
    <div className="signup-container">

      <form onSubmit={handleSubmit} className="signup-box">
        <h2 className="signup-title">Create Account</h2>

        <input
          type="text"
          placeholder="User Name *"
          name="userName"
          value={formData.userName}
          disabled={googleData}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email *"
          name="email"
          value={formData.email}
          disabled={googleData}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password *"
          name="password"
          value={formData.password}
          disabled={googleData}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Address *"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="City *"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />

        {!googleData && (
          <input type="file" accept="image/*" onChange={handleFile} />
        )}

        <div className="coords">
          <strong>Location:</strong>{" "}
          {formData.latitude
            ? `${formData.latitude}, ${formData.longitude}`
            : "Detecting..."}
        </div>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Please wait..." : "Signup"}
        </button>
      </form>

      {/* ✅ GOOGLE SIGNUP */}
      {!googleData && (
        <div className="google-wrapper">
          <p>Or</p>
          <div className="google-btn">
            <GoogleLogin
              theme="filled_blue"
              size="large"
              onSuccess={handleGoogleSignup}
              onError={() => showPopup("error", "Google Signup Failed")}
            />
          </div>
        </div>
      )}

      {popup.show && <Notification type={popup.type} message={popup.message} />}
      
    </div>
  );
};

export default Signup;
