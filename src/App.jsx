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
        <Route path="/seller-products/:userId" element={<SellerProducts />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/sell" element={<Sell />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/chats" element={<Chat />} />
          <Route path="/chat/:userId/:productId" element={<Chatting />} />
          <Route path="/payment-success" element={<Payment />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
