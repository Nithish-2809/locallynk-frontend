import "../Styles/Loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="spinner"></div>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Loader;
