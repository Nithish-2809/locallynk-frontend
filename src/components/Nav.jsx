import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";
import "../Styles/Nav.css";

export default function Nav() {
  return (
    <nav className="nav">
      {/* Logo */}
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          Local<span className="logo-accent">Lynk</span>
        </Link>
      </div>

      {/* Search Section */}
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
        <NavLink to="/login" className="nav-link">Login</NavLink>
        <NavLink to="/signup" className="nav-link">Signup</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
      </div>
    </nav>
  );
}
