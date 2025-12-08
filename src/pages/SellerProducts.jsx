import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/SellerProducts.css";

export default function SellerProducts() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSellerProducts = async () => {
    try {
        const res = await axios.get(
            `https://locallynk-production.up.railway.app/product/seller/${userId}`
            );


      const items = res.data.products;

      setProducts(items);
      if (items.length > 0) {
        setSeller(items[0].Seller); // seller details included
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching seller products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [userId]);

  if (loading) return <p className="sp-loading">Loading seller products...</p>;

  return (
    <div className="sp-wrapper">
      {seller && (
        <div className="sp-seller-card">
          <img
            src={
              seller.profilePic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Seller"
            className="sp-seller-img"
          />
          <h2>{seller.userName}</h2>
          <p>{seller.email}</p>
          <p>📍 {seller.location?.city}</p>
        </div>
      )}

      <h2 className="sp-title">Products by {seller?.userName}</h2>

      {products.length === 0 ? (
        <p className="sp-empty">This seller has no products listed.</p>
      ) : (
        <div className="sp-grid">
          {products.map((product) => (
            <div
              className="sp-card"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.image} alt="" className="sp-image" />
              <div className="sp-info">
                <h3>{product.productName}</h3>
                <p className="sp-price">₹ {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
