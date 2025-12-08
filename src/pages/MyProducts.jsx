import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/MyProducts.css";

function MyProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(
        "https://locallynk-production.up.railway.app/product/my-products",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      console.log("MY PRODUCTS RESPONSE:", res.data);

      setProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching my products:", err);
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  if (loading) return <p className="mp-loading">Loading your products...</p>;

  return (
    <div className="mp-wrapper">
      <h2 className="mp-title">My Products</h2>

      {products.length === 0 ? (
        <p className="mp-empty">You haven’t listed any products yet.</p>
      ) : (
        <div className="mp-grid">
          {products.map((item) => (
            <div
              className="mp-card"
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.image} alt="" className="mp-img" />

              <div className="mp-info">
                <h3>{item.productName}</h3>
                <p className="mp-price">₹ {item.price}</p>

                <p className="mp-status">
                  Status:{" "}
                  <span
                    className={item.status === "available" ? "green" : "red"}
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
  );
}

export default MyProducts;
