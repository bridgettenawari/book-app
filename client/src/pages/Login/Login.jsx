import { useState } from "react";
import { apiPost } from "../../Api.js";
import "./Login.css";

function Login({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleLogin = (e) => {
		e.preventDefault();
		apiPost("/login", { username, password })
			.then((data) => {
				if (data.error) setError(data.error);
				else {
					setError(null);
					alert("Login successful!");
					onLogin(data); // persist user data
				}
			})
			.catch((err) => setError(err.message));
	};

	return (
		<div className="login">
			<h2 className="login-title">Login</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleLogin}>
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
				<div className="login-btn-cont">
					<button className="login-btn" type="submit">
						Login
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
