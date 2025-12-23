import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowPopup(true);

      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <>
        {showPopup && (
          <Notification
            type="error"
            message="Please login to continue"
          />
        )}
      </>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
