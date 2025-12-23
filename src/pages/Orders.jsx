import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import "../Styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.get(
        "https://locallynk.onrender.com/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
    } catch (err) {
      showPopup(
        "error",
        err.response?.data?.msg || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      {loading && <Loader text="Loading your orders..." />}
      {popup && (
        <Notification
          type={popup.type}
          message={popup.message}
        />
      )}

      <div className="orders-wrapper">
        <h2 className="orders-title">My Orders</h2>

        {!loading && orders.length === 0 && (
          <p className="orders-empty">
            You haven’t placed any orders yet.
          </p>
        )}

        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <img
                src={order.product?.image}
                alt={order.product?.productName}
                className="order-image"
              />

              <div className="order-info">
                <h3 className="order-name">
                  {order.product?.productName}
                </h3>

                <p className="order-price">
                  ₹ {order.amount}
                </p>

                <p className={`order-status ${order.status}`}>
                  {order.status.toUpperCase()}
                </p>

                <p className="order-seller">
                  Seller: {order.seller?.userName}
                </p>

                <p className="order-date">
                  Ordered on:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Orders;
