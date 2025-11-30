
import "../Styles/Notification.css"

const Notification = ({ type, message }) => {
  return (
    <div
      className={`noti-popup ${type === "success" ? "success" : "error"}`}
    >
      {message}
    </div>
  );
};

export default Notification;
