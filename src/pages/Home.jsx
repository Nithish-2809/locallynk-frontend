import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../Styles/Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------
     READ QUERY PARAMS
     --------------------------------- */
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const searchQuery = params.get("search");
  const nearby = params.get("near");
  const lat = params.get("lat");
  const lng = params.get("lng");

  /* ---------------------------------
     FETCH PRODUCTS
     --------------------------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = "https://locallynk.onrender.com/product";

      // 🔍 Search by product name
      if (searchQuery) {
        url = `https://locallynk.onrender.com/product/search?name=${searchQuery}`;
      }

      // 📍 Nearby products (highest priority)
      if (nearby && lat && lng) {
        url = `https://locallynk.onrender.com/product/near?lat=${lat}&lng=${lng}`;
      }

      const res = await axios.get(url);
      setProducts(res.data.products || []);
      setLoading(false);

    } catch (error) {
      console.error("Failed to load products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, nearby, lat, lng]);

  /* ---------------------------------
     UI
     --------------------------------- */
  return (
    <div className="home-wrapper">

      {/* TITLE BASED ON MODE */}
      {nearby && (
        <h2 className="home-title">
          Nearby Products 📍
        </h2>
      )}

      {!nearby && !searchQuery && (
        <h2 className="home-title">
          Latest Products
        </h2>
      )}

      {searchQuery && (
        <h2 className="home-title">
          Search results for "{searchQuery}"
        </h2>
      )}

      {/* STATES */}
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products">No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>

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

                <p className="product-category">
                  {product.category}
                </p>

                <p className="product-age">
                  Condition: {product.age}
                </p>

                {/* SELLER */}
                {product.Seller && (
                  <p className="product-seller">
                    Seller: <span>{product.Seller.userName}</span>
                  </p>
                )}

                {/* LOCATION */}
                {product.location?.city && (
                  <p className="product-location">
                    📍 {product.location.city}, {product.location.address}
                  </p>
                )}

                {/* DISTANCE (NEARBY MODE ONLY) */}
                {product.distanceKm && (
                  <p className="product-distance">
                    🛣️ {product.distanceKm} away
                  </p>
                )}
              </div>

              {/* VIEW BUTTON */}
              <button
                className="view-btn"
                onClick={() =>
                  window.location.href = `/product/${product._id}`
                }
              >
                View Details
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
