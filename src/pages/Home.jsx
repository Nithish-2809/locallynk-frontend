import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Home.css"; 

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://locallynk-production.up.railway.app/product"
      );

      setProducts(res.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="home-wrapper">

      <h2 className="home-title">Latest Products</h2>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products">No products available</p>
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
