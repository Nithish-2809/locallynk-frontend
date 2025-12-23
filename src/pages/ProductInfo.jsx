import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader"; // ✅ ADD
import Notification from "../components/Notification";
import "../Styles/Product.css";

function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  /* ---------- popup helper ---------- */
  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  /* ---------- fetch product ---------- */
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://locallynk.onrender.com/product/${id}`
      );

      setProduct(res.data.product);

    } catch (err) {
      console.error("Failed to load product:", err);
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  /* ---------- UI ---------- */
  return (
    <>
      {/* ✅ GLOBAL LOADER */}
      {loading && <Loader text="Loading product..." />}

      {!loading && !product && (
        <p className="pd-error">Product not found or sold out.</p>
      )}

      {!loading && product && (
        <div className="pd-wrapper">
          {popup && (
            <Notification
              type={popup.type}
              message={popup.message}
            />
          )}

          {/* LEFT IMAGE */}
          <div className="pd-left">
            <img
              src={product.image}
              alt={product.productName}
              className="pd-image"
            />
          </div>

          {/* RIGHT DETAILS */}
          <div className="pd-right">
            <h2 className="pd-name">{product.productName}</h2>
            <p className="pd-price">₹ {product.price}</p>
            <p className="pd-category">Category: {product.category}</p>
            <p className="pd-age">Condition: {product.age}</p>
            <p className="pd-description">{product.description}</p>

            {product.location && (
              <p className="pd-location">
                📍 {product.location.city}, {product.location.address}
              </p>
            )}

            {product.location?.coordinates && (
              <a
                href={`https://www.google.com/maps?q=${product.location.coordinates[1]},${product.location.coordinates[0]}`}
                target="_blank"
                rel="noreferrer"
                className="pd-map-link"
              >
                View on Google Maps
              </a>
            )}

            <button
              className="seller-products-btn"
              style={{ marginTop: "10px" }}
            >
              Buy Now
            </button>

            {/* SELLER CARD */}
            <div className="seller-card">
              <h3>Seller Details</h3>

              <img
                src={
                  product.Seller?.profilePic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Seller"
                className="seller-image"
              />

              <p className="seller-name">
                {product.Seller?.userName}
              </p>

              <p className="seller-email">
                {product.Seller?.email}
              </p>

              {product.Seller?.location?.city && (
                <p className="seller-location">
                  📍 {product.Seller.location.city},{" "}
                  {product.Seller.location.address}
                </p>
              )}

              {/* CHAT WITH SELLER */}
              <button
                className="seller-products-btn"
                style={{
                  background: "#3b82f6",
                  marginBottom: "10px",
                }}
                onClick={() => {
                  const token = localStorage.getItem("token");

                  // 🔐 NOT LOGGED IN
                  if (!token) {
                    showPopup(
                      "error",
                      "Please login to chat with the seller"
                    );
                    setTimeout(() => navigate("/login"), 2000);
                    return;
                  }

                  const currentUser = JSON.parse(
                    localStorage.getItem("user") || "{}"
                  );
                  const myId =
                    currentUser?._id || currentUser?.id;

                  // 🚫 CHAT WITH SELF
                  if (myId === product.Seller._id) {
                    showPopup(
                      "error",
                      "You cannot chat with yourself"
                    );
                    return;
                  }

                  // ✅ GO TO CHAT
                  navigate(
                    `/chat/${product.Seller._id}/${product._id}`,
                    {
                      state: { receiver: product.Seller },
                    }
                  );
                }}
              >
                Chat with Seller
              </button>

              {/* VIEW SELLER PRODUCTS */}
              <button
                className="seller-products-btn"
                onClick={() =>
                  navigate(
                    `/seller-products/${product.Seller._id}`
                  )
                }
              >
                View Seller’s Products
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductInfo;
