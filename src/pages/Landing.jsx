import { useNavigate } from "react-router-dom";
import "../Styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="landing-wrapper">
      {/* HERO */}
      <section className="hero">
        <h1>
          Buy & Sell Locally <span>Without Hassle</span>
        </h1>
        <p>
          A modern marketplace to discover nearby products,
          chat instantly with sellers, and get products delivered instantly.
        </p>

        <div className="hero-buttons">
          {/* ✅ GET STARTED */}
          <button
            className="primary-btn"
            onClick={() =>
              navigate(isLoggedIn ? "/home" : "/signup")
            }
          >
            Get Started
          </button>

          {/* ✅ LOGIN (ONLY FOR LOGGED OUT USERS) */}
          {!isLoggedIn && (
            <button
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>📍 Nearby Discovery</h3>
          <p>Find products available near your location.</p>
        </div>

        <div className="feature-card">
          <h3>💬 Real-time Chat</h3>
          <p>Chat directly with sellers before buying.</p>
        </div>

        <div className="feature-card">
          <h3>💲💸 Lowest prices</h3>
          <p>Get the best products at a best price.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
