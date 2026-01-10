import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import "../Styles/Sell.css";

const initialForm = {
  productName: "",
  price: "",
  age: "",
  description: "",
  category: "",
  city: "",
  address: "",
  image: null,
  latitude: "",
  longitude: "",
};

function Sell() {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [popup, setPopup] = useState(null);

  /* ================= POPUP ================= */
  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  /* ================= GEO LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => showPopup("error", "Location permission denied")
    );
  }, []);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= IMAGE HANDLER (2MB CHECK) ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_SIZE) {
      showPopup("error", "Image size must be less than 2 MB");
      e.target.value = ""; // reset file input
      setPreview(null);
      setForm((prev) => ({ ...prev, image: null }));
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ================= FORM VALIDATION ================= */
  const isFormValid = () => {
    const required = [
      "productName",
      "price",
      "age",
      "description",
      "category",
      "city",
      "address",
      "image",
      "latitude",
      "longitude",
    ];

    return required.every((key) => Boolean(form[key]));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;

    if (!isFormValid()) {
      showPopup("error", "Please complete all fields");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== "latitude" && key !== "longitude") {
          data.append(key, value);
        }
      });

      data.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [form.longitude, form.latitude],
          city: form.city,
          address: form.address,
        })
      );

      await axios.post(
        "https://locallynk.onrender.com/product/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showPopup("success", "Product listed successfully 🎉");

      setForm({
        ...initialForm,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      showPopup("error", "Failed to upload product");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sell-wrapper">
      <h2 className="sell-title">Sell Your Product</h2>

      <form className="sell-form" onSubmit={handleSubmit}>
        <input
          name="productName"
          placeholder="Product name"
          value={form.productName}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="age"
          placeholder="Product age"
          value={form.age}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Describe your product"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        {/* ================= IMAGE UPLOAD ================= */}
        <div className="image-upload-box">
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && (
            <img src={preview} alt="Preview" className="preview-img" />
          )}
        </div>

        <button className="sell-btn" disabled={uploading}>
          {uploading ? "Uploading..." : "List Product"}
        </button>
      </form>

      {popup && <Notification type={popup.type} message={popup.message} />}
    </div>
  );
}

export default Sell;
