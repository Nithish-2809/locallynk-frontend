import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // ✅ ADD
import "../Styles/MyProducts.css";

function MyProducts() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚫 No token → don’t even try
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMyProducts = async () => {
      try {
        setLoading(true); // ✅ start loader

        const res = await axios.get(
          "https://locallynk.onrender.com/product/my-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(res.data.products || []);

      } catch (err) {
        console.error("Error fetching my products:", err);
        setProducts([]);
      } finally {
        setLoading(false); // ✅ stop loader
      }
    };

    fetchMyProducts();
  }, []);

  return (
    <>
      {/* ✅ GLOBAL LOADER */}
      {loading && <Loader text="Loading your products..." />}

      <div className="mp-wrapper">
        <h2 className="mp-title">My Products</h2>

        {!loading && products.length === 0 ? (
          <p className="mp-empty">
            You haven’t listed any products yet.
          </p>
        ) : (
          <div className="mp-grid">
            {products.map((item) => (
              <div
                className="mp-card"
                key={item._id}
                onClick={() =>
                  navigate(`/product/${item._id}`)
                }
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="mp-img"
                />

                <div className="mp-info">
                  <h3>{item.productName}</h3>
                  <p className="mp-price">
                    ₹ {item.price}
                  </p>

                  <p className="mp-status">
                    Status:{" "}
                    <span
                      className={
                        item.status === "available"
                          ? "green"
                          : "red"
                      }
                    >
                      {item.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyProducts;
