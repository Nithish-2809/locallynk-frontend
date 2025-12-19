import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../Styles/Home.css"; 

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get search query from URL → /?search=phone
  const { search } = useLocation();
  const searchQuery = new URLSearchParams(search).get("search");

  const fetchProducts = async () => {
    try {
      let url = "https://locallynk.onrender.com/product";

      // If search query exists → use search API
      if (searchQuery) {
        url = `https://locallynk.onrender.com/product/search?name=${searchQuery}`;
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
  }, [searchQuery]); // re-fetch when search term changes

  return (
    <div className="home-wrapper">

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products">No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.productName}
                className="product-image"
              />

              {/* Info */}
              <div className="product-info">
                <h3 className="product-name">{product.productName}</h3>

                <p className="product-price">₹ {product.price}</p>

                <p className="product-category">{product.category}</p>

                <p className="product-age">Condition: {product.age}</p>

                {/* Seller info */}
                {product.Seller && (
                  <p className="product-seller">
                    Seller: <span>{product.Seller.userName}</span>
                  </p>
                )}

                {/* Location */}
                {product.location?.city && (
                  <p className="product-location">
                    📍 {product.location.city}, {product.location.address}
                  </p>
                )}
              </div>

              {/* View Button */}
              <button
                className="view-btn"
                onClick={() => {
                  window.location.href = `/product/${product._id}`;
                }}
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
