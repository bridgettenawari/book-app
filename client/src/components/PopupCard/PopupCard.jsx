import "./PopupCard.css";
import { NavLink } from "react-router-dom";

function PopupCard({ onClose }) {
	return (
		<div className="popup">
			<div className="popup-content">
				<p className="popup-message">Sign in to perform this action!</p>
				<div className="popup-links">
					<button className="popup-login">
						<NavLink to="/login" className="popup-login">
							Login
						</NavLink>
					</button>
					<button className="popup-signup">
						<NavLink to="/signup" className="popup-signup">
							Sign Up
						</NavLink>
					</button>
				</div>
				<button className="popup-close" onClick={onClose}>
					X
				</button>
			</div>
		</div>
	);
}
export default PopupCard;
