import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sell from "./pages/Sell";
import MyProducts from "./pages/MyProducts";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import ProductInfo from "./pages/ProductInfo";
import SellerProducts from "./pages/SellerProducts";
import Chatting from "./pages/Chatting";

import ProtectedRoute from "./routes/ProtectedRoute";

// ✅ STRIPE IMPORTS
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// ✅ STRIPE INSTANCE (ONCE)
const stripePromise = loadStripe(
  "pk_test_51ShbheFLKTNMgEtqgsHRo1TtL86JUjAXbrJbgEsXyFaXhMHDSZ70Odw5gL07k3XfBb12xGLiYbQwfO2gmSZ4KkQ900HgwOJOL1"
);

function App() {
  return (
    <div>
      <Nav />

      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductInfo />} />
        <Route
          path="/seller-products/:userId"
          element={<SellerProducts />}
        />

        {/* 🔒 PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/sell" element={<Sell />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/chats" element={<Chat />} />
          <Route
            path="/chat/:userId/:productId"
            element={<Chatting />}
          />

          {/* ✅ STRIPE PAYMENT ROUTE */}
          <Route
            path="/payment/:orderId"
            element={
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
