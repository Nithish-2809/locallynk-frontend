import {  Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";

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

function App() {
  return (
  <div>
      <Nav/>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/sell" element={<Sell />} />
        <Route path="/my-products" element={<MyProducts />} />

        <Route path="/product/:id" element={<ProductInfo />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/orders" element={<Orders />} />

        <Route path="/payment-success" element={<Payment />} />
      </Routes>
    </div>

  );
}

export default App