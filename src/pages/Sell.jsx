import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import "../Styles/Sell.css";

function Sell() {
  const [form, setForm] = useState({
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
  });

  const [preview, setPreview] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Popup state
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 2500);
  };

  // AUTO DETECT LOCATION (lat + long only)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
          setLoadingLocation(false);
        },
        () => setLoadingLocation(false)
      );
    } else setLoadingLocation(false);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // ================================
  // SUBMIT PRODUCT WITH LOADER + DISABLE MULTIPLE CLICKS
  // ================================
  const submitProduct = async () => {
    // Prevent double clicks
    if (uploading) return;

    // VALIDATION
    if (!form.productName || !form.price || !form.age || !form.description || !form.category || !form.city || !form.address || !form.image) {
      showPopup("error", "Please fill all fields and upload an image");
      return;
    }

    if (!form.latitude || !form.longitude) {
      showPopup("error", "Location not detected");
      return;
    }

    try {
      setUploading(true); // start loader

      const data = new FormData();
      data.append("productName", form.productName);
      data.append("price", form.price);
      data.append("age", form.age);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("image", form.image);

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
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showPopup("success", "Product uploaded successfully!");

      // RESET FORM
      setForm({
        productName: "",
        price: "",
        age: "",
        description: "",
        category: "",
        city: "",
        address: "",
        image: null,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      setPreview(null);

    } catch (err) {
      console.error(err);
      showPopup("error", "Failed to upload product");
    } finally {
      setUploading(false); // re-enable button
    }
  };

  return (
    <div className="sell-wrapper">
      <h2 className="sell-title">Sell Your Product</h2>

      <div className="sell-form">
        <input name="productName" placeholder="Product name" value={form.productName} onChange={handleChange} />

        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />

        <input name="age" placeholder="Product age" value={form.age} onChange={handleChange} />

        <textarea name="description" placeholder="Describe your product" value={form.description} onChange={handleChange} />

        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />

        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />

        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

        {/* IMAGE UPLOAD */}
        <div className="image-upload-box">
          <label>Upload Image</label>
          <input type="file" onChange={handleFile} />
          {preview && <img src={preview} className="preview-img" />}
        </div>

        {/* LOCATION STATUS */}
        
        {/* SUBMIT BUTTON */}
        <button
          className="sell-btn"
          onClick={submitProduct}
          disabled={uploading}
          style={{ opacity: uploading ? 0.6 : 1 }}
        >
          {uploading ? "Uploading..." : "Submit Product"}
        </button>
      </div>

      {popup.show && <Notification type={popup.type} message={popup.message} />}
    </div>
  );
}

export default Sell;
