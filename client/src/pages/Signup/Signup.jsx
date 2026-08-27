import { useState } from "react";
import { apiPost, setToken } from "../../Api.js";
import "./Signup.css";

function Signup({ onSignup }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleSignup = (e) => {
		e.preventDefault();
		apiPost("/signup", { username, password })
			.then((data) => {
				if (data.error) setError(data.error);
				else {
					setError(null);
					setToken(data.access_token); // store JWT for future requests
					alert("Signup successful!");
					if (onSignup) onSignup(data.user);
				}
			})
			.catch((err) => setError(err.message));
	};

	return (
		<div className="signup">
			<h2 className="signup-title">Signup</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleSignup}>
				<div className="username-cont">
					<label className="label" htmlFor="username">
						Username:
					</label>
					<input
						className="input"
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="password-cont">
					<label className="label" htmlFor="password">
						Password:
					</label>
					<input
						className="input"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="signup-btn-cont">
					<button className="signup-btn" type="submit">
						Signup
					</button>
				</div>
			</form>
		</div>
	);
}

export default Signup;