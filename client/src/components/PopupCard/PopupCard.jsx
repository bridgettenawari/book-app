import './PopupCard.css';

function PopupCard({ message, onClose }) {
  return (
    <div className="popup-card">
      <div className="popup-card-content">
        <p className="popup-card-message">{message}</p>
        <div className="popup-card-links">
          <NavLink to="/login" className="popup-card-link">
            Login
          </NavLink>
          <NavLink to="/signup" className="popup-card-link">
            Sign Up
          </NavLink>
        </div>
        <button className="popup-card-close-btn" onClick={onClose}>
          ㄨ
        </button>
      </div>
    </div>
  );
}
export default PopupCard;