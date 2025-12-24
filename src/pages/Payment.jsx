import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Notification from "../components/Notification";



import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import "../Styles/Payment.css";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [order, setOrder] = useState(null); // ✅ order + product

  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  /* ===============================
     FETCH ORDER DETAILS
     =============================== */
  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "https://locallynk.onrender.com/order/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentOrder = res.data.orders.find(
          (o) => o._id === orderId
        );

        if (!currentOrder) {
          showPopup("error", "Order not found");
          navigate("/");
          return;
        }

        setOrder(currentOrder);
      } catch (err) {
        showPopup("error", "Failed to load order");
        navigate("/");
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  /* ===============================
     HANDLE PAYMENT
     =============================== */
  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create PaymentIntent
      const res = await axios.post(
        "https://locallynk.onrender.com/payment/create",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(
        res.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (result.error) {
        throw new Error(result.error.message);
      }

      // 3️⃣ Verify payment
      await axios.post(
        "https://locallynk.onrender.com/payment/verify",
        {
          paymentIntentId: result.paymentIntent.id,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ SUCCESS MESSAGE + REDIRECT HOME
      showPopup(
        "success",
        "Order placed! Delivering in 3 days 🚚"
      );
      setTimeout(() => navigate("/home"), 2500);
    } catch (err) {
      showPopup(
        "error",
        err.response?.data?.msg || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <Loader text="Loading order details..." />;
  }

  const { product, seller, amount } = order;

  return (
    <>
      {loading && <Loader text="Processing payment..." />}
      {popup && (
        <Notification
          type={popup.type}
          message={popup.message}
        />
      )}

      <div className="payment-wrapper">
        <div className="payment-card">
          <h2 className="payment-title">Confirm Your Order</h2>

          {/* 🛍 PRODUCT DETAILS */}
          <div className="payment-product">
            <img
              src={product.image}
              alt={product.productName}
              className="payment-product-img"
            />

            <div className="payment-product-info">
              <h3>{product.productName}</h3>
              <p className="payment-price">₹ {amount}</p>
              <p className="payment-seller">
                Seller: {seller.userName}
              </p>
            </div>
          </div>

          {/* 💳 CARD */}
          <div className="card-element-wrapper">
            <CardElement />
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="payment-btn"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Payment;
