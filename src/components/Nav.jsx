import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import "../Styles/Nav.css";

export default function Nav() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // 🔍 SEARCH FUNCTION
  const handleSearch = () => {
    if (!searchText.trim()) return;

    navigate(`/?search=${encodeURIComponent(searchText)}`);
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
          <input
            className="search-input"
            placeholder="Search products"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="icon-btn" onClick={handleSearch}>
            <FiSearch size={18} />
          </button>
        </div>
      </div>

      {/* Right Navigation */}
      <div className="nav-right">

        {!isLoggedIn && (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Signup</NavLink>
          </>
        )}

        {isLoggedIn && (
          <>
            <NavLink to="/sell" className="nav-link">Sell</NavLink>
            <NavLink to="/chat" className="nav-link">Chats</NavLink>
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
