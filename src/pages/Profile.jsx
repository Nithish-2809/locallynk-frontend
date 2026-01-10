import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import "../Styles/Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.id || storedUser?._id;

  const DEFAULT_AVATAR =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  /* ================= POPUP ================= */
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 2500);
  };

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    userName: "",
    email: "",
    address: "",
    city: "",
    profilePic: DEFAULT_AVATAR,
    latitude: "",
    longitude: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (!storedUser) return;

    setForm({
      userName: storedUser.userName || "",
      email: storedUser.email || "",
      address: storedUser.location?.address || "",
      city: storedUser.location?.city || "",
      profilePic: storedUser.profilePic || DEFAULT_AVATAR,
      latitude: storedUser.location?.coordinates?.[1] || "",
      longitude: storedUser.location?.coordinates?.[0] || "",
    });
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ================= IMAGE VALIDATION ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_SIZE) {
      showPopup("error", "Image size must be less than 2 MB");
      e.target.value = ""; // reset input
      return;
    }

    setProfilePicFile(file);
    setForm((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(file),
    }));
  };

  /* ================= REMOVE IMAGE ================= */
  const removeProfilePic = () => {
    setProfilePicFile(null);
    setForm((prev) => ({ ...prev, profilePic: DEFAULT_AVATAR }));
    showPopup("success", "Profile picture removed");
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const data = new FormData();
      data.append("userName", form.userName);
      data.append("email", form.email);
      data.append("address", form.address);
      data.append("city", form.city);

      data.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [Number(form.longitude), Number(form.latitude)],
          address: form.address,
          city: form.city,
        })
      );

      if (profilePicFile) {
        data.append("profilePic", profilePicFile);
      } else if (form.profilePic === DEFAULT_AVATAR) {
        data.append("removePic", "true");
      }

      const res = await axios.patch(
        `https://locallynk.onrender.com/user/${userId}`,
        data
      );

      const updatedUser = res.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify({ ...updatedUser, id: updatedUser._id })
      );

      setForm({
        userName: updatedUser.userName,
        email: updatedUser.email,
        address: updatedUser.location.address,
        city: updatedUser.location.city,
        profilePic: updatedUser.profilePic || DEFAULT_AVATAR,
        latitude: updatedUser.location.coordinates[1],
        longitude: updatedUser.location.coordinates[0],
      });

      showPopup("success", "Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      showPopup("error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-inner">

        {/* ================= LEFT CARD ================= */}
        <div className="profile-card">
          <h2 className="profile-title">My Profile</h2>

          <div className="profile-avatar">
            <img src={form.profilePic} alt="Profile" />

            {editMode && (
              <div className="pic-controls">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button className="remove-pic-btn" onClick={removeProfilePic}>
                  Remove Picture
                </button>
              </div>
            )}
          </div>

          <div className="profile-fields">
            <label>Username</label>
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              disabled={!editMode}
            />

            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
            />

            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!editMode}
            />

            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          {!editMode ? (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <button
              className="save-btn"
              onClick={saveProfile}
              disabled={saving}
              style={{ opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="profile-side">
          <div className="side-card">
            <button
              className="side-btn primary"
              onClick={() => navigate("/my-products")}
            >
              My Products
            </button>

            <button
              className="side-btn secondary"
              onClick={() => navigate("/orders")}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      {popup.show && (
        <Notification type={popup.type} message={popup.message} />
      )}
    </div>
  );
}

export default Profile;
