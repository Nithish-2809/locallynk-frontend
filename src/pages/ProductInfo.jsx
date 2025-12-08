import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Product.css";

function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://locallynk-production.up.railway.app/product/${id}`
      );

      setProduct(res.data.product);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load product:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) return <p className="pd-loading">Loading product...</p>;

  if (!product)
    return <p className="pd-error">Product not found or sold out.</p>;

  const seller = product.Seller;

  return (
    <div className="pd-wrapper">

      {/* LEFT SIDE – IMAGE */}
      <div className="pd-left">
        <img
          src={product.image}
          alt={product.productName}
          className="pd-image"
        />
      </div>

      {/* RIGHT SIDE – DETAILS */}
      <div className="pd-right">

        <h2 className="pd-name">{product.productName}</h2>

        <p className="pd-price">₹ {product.price}</p>

        <p className="pd-category">Category: {product.category}</p>

        <p className="pd-age">Condition: {product.age}</p>

        <p className="pd-description">{product.description}</p>

        {/* LOCATION */}
        {product.location && (
          <p className="pd-location">
            📍 {product.location.city}, {product.location.address}
          </p>
        )}

        {/* Google Maps link */}
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

        {/* SELLER CARD */}
        <div className="seller-card">
          <h3>Seller Details</h3>

          <img
            src={
              seller?.profilePic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Seller"
            className="seller-image"
          />

          <p className="seller-name">{seller?.userName}</p>
          <p className="seller-email">{seller?.email}</p>

          {seller?.location?.city && (
            <p className="seller-location">
              📍 {seller.location.city}, {seller.location.address}
            </p>
          )}


          {/* View seller products */}
          <button
            className="seller-products-btn"
            onClick={() => navigate("/my-products")}
          >
            View Seller’s Products
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductInfo;
