import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "../Styles/Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const searchQuery = params.get("search");
  const nearby = params.get("near");
  const lat = params.get("lat");
  const lng = params.get("lng");

  /* ===============================
     GET LOGGED IN USER ID (SAFE)
     =============================== */
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  const loggedInUserId =
    storedUser?._id || storedUser?.id || null;

  /* ===============================
     FETCH PRODUCTS
     =============================== */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = "https://locallynk.onrender.com/product";

      if (searchQuery) {
        url = `https://locallynk.onrender.com/product/search?name=${searchQuery}`;
      }

      if (nearby && lat && lng) {
        url = `https://locallynk.onrender.com/product/near?lat=${lat}&lng=${lng}`;
      }

      const res = await axios.get(url);
      const allProducts = res.data.products || [];

      // 🚫 FILTER OUT MY OWN PRODUCTS
      const filteredProducts = loggedInUserId
        ? allProducts.filter(
            (product) =>
              product.Seller?._id !== loggedInUserId
          )
        : allProducts;

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, nearby, lat, lng]);

  /* ===============================
     UI
     =============================== */
  return (
    <>
      {loading && <Loader text="Loading products..." />}

      <div className="home-wrapper">
        {/* TITLE */}
        {nearby && <h2 className="home-title">Nearby Products 📍</h2>}

        {!nearby && !searchQuery && (
          <h2 className="home-title">Latest Products</h2>
        )}

        {searchQuery && (
          <h2 className="home-title">
            Search results for "{searchQuery}"
          </h2>
        )}

        {/* CONTENT */}
        {!loading && products.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div
                className={`product-card ${
                  product.status === "sold"
                    ? "sold-card"
                    : ""
                }`}
                key={product._id}
              >
                {/* IMAGE */}
                <img
                  src={product.image}
                  alt={product.productName}
                  className="product-image"
                />

                {/* INFO */}
                <div className="product-info">
                  <h3 className="product-name">
                    {product.productName}
                  </h3>

                  <p className="product-price">
                    ₹ {product.price}
                  </p>

                  {/* STATUS */}
                  <span
                    className={`product-status ${
                      product.status === "sold"
                        ? "sold"
                        : "available"
                    }`}
                  >
                    {product.status}
                  </span>

                  <p className="product-category">
                    {product.category}
                  </p>

                  <p className="product-age">
                    Condition: {product.age}
                  </p>

                  {/* SELLER */}
                  {product.Seller && (
                    <p className="product-seller">
                      Seller:{" "}
                      <span>{product.Seller.userName}</span>
                    </p>
                  )}

                  {/* LOCATION */}
                  {product.location?.city && (
                    <p className="product-location">
                      📍 {product.location.city},{" "}
                      {product.location.address}
                    </p>
                  )}

                  {/* DISTANCE */}
                  {product.distanceKm && (
                    <p className="product-distance">
                      🛣️ {product.distanceKm} away
                    </p>
                  )}
                </div>

                {/* ACTION BUTTON */}
                <button
                  className="view-btn"
                  disabled={product.status === "sold"}
                  onClick={() =>
                    product.status !== "sold" &&
                    navigate(`/product/${product._id}`)
                  }
                >
                  {product.status === "sold"
                    ? "Sold Out"
                    : "View Details"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
