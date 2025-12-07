import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";
import "../Styles/Nav.css";

export default function Nav() {

  const navigate = useNavigate();

  // ✅ Check login state
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();   // re-render navbar
  };

  return (
    <nav className="nav">

      {/* Logo */}
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          Local<span className="logo-accent">Lynk</span>
        </Link>
      </div>

      {/* Search */}
      <div className="nav-center">
        <div className="search-box">
          <input className="search-input" placeholder="Search products" />
          <button className="icon-btn">
            <FiSearch size={18} />
          </button>
        </div>
        <button className="map-btn">
          <FiMapPin size={18} />
        </button>
      </div>

      {/* Right Navigation */}
      <div className="nav-right">

        <NavLink to="/sell" className="nav-link">Sell</NavLink>
        <NavLink to="/chat" className="nav-link">Chats</NavLink>

        {/* ✅ NOT LOGGED IN */}
        {!isLoggedIn && (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Signup</NavLink>
          </>
        )}

        {/* ✅ LOGGED IN */}
        {isLoggedIn && (
          <>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            <span className="nav-link logout-btn" onClick={handleLogout}>
              Logout
            </span>
          </>
        )}

      </div>
    </nav>
  );
}
