import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import "../Styles/Profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Correct ID from backend
  const userId = storedUser?.id || storedUser?._id;

  const DEFAULT_AVATAR =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 2500);
  };

  // Main form state
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

  // --------------------------------------------------
  // LOAD USER DATA ONCE
  // --------------------------------------------------
  useEffect(() => {
    if (storedUser) {
      setForm({
        userName: storedUser.userName || "",
        email: storedUser.email || "",
        address: storedUser.location?.address || "",
        city: storedUser.location?.city || "",
        profilePic: storedUser.profilePic || DEFAULT_AVATAR,
        latitude: storedUser.location?.coordinates?.[1] || "",
        longitude: storedUser.location?.coordinates?.[0] || "",
      });
    }
  }, []);

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --------------------------------------------------
  // HANDLE PROFILE PIC CHANGE
  // --------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);

    if (file) {
      // preview new pic
      setForm((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
      }));
    }
  };

  // --------------------------------------------------
  // REMOVE PROFILE PIC
  // --------------------------------------------------
  const removeProfilePic = () => {
    setProfilePicFile(null);
    setForm((prev) => ({ ...prev, profilePic: DEFAULT_AVATAR }));
    showPopup("success", "Profile picture removed");
  };

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------
  const saveProfile = async () => {
    try {
      const data = new FormData();
      data.append("userName", form.userName);
      data.append("email", form.email);
      data.append("address", form.address);
      data.append("city", form.city);

      // LOCATION
      data.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [Number(form.longitude), Number(form.latitude)],
          address: form.address,
          city: form.city,
        })
      );

      // PROFILE PIC HANDLING
      if (profilePicFile) {
        data.append("profilePic", profilePicFile);
      } else if (form.profilePic === DEFAULT_AVATAR) {
        data.append("removePic", "true");
      }

      // PATCH request
      const res = await axios.patch(
        `https://locallynk-production.up.railway.app/user/${userId}`,
        data
      );

      const updatedUser = res.data.user;

      // Always save consistent ID
      localStorage.setItem(
        "user",
        JSON.stringify({ ...updatedUser, id: updatedUser._id })
      );

      showPopup("success", "Profile updated successfully!");

      // Update UI
      setForm({
        userName: updatedUser.userName,
        email: updatedUser.email,
        address: updatedUser.location.address,
        city: updatedUser.location.city,
        profilePic: updatedUser.profilePic || DEFAULT_AVATAR,
        latitude: updatedUser.location.coordinates[1],
        longitude: updatedUser.location.coordinates[0],
      });

      setEditMode(false);
    } catch (err) {
      console.error(err);
      showPopup("error", "Failed to update profile");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        {/* Profile Image */}
        <div className="profile-pic-wrapper">
          <img
            src={form.profilePic || DEFAULT_AVATAR}
            alt="Profile"
            className="profile-pic"
          />

          {editMode && (
            <>
              <input type="file" onChange={handleFileChange} />
              <button className="btn-remove" onClick={removeProfilePic}>
                Remove Profile Picture
              </button>
            </>
          )}
        </div>

        {/* Profile Fields */}
        <div className="profile-details">
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

        {/* Buttons */}
        {!editMode ? (
          <button className="btn-edit" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <button className="btn-save" onClick={saveProfile}>
            Save Changes
          </button>
        )}
      </div>

      {popup.show && <Notification type={popup.type} message={popup.message} />}
    </div>
  );
}

export default Profile;
