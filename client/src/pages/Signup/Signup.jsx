import { useState } from "react";
import { apiPost } from "../../Api.js"; 
import "./Signup.css";

function Signup() {
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
					alert("Signup successful!");
				}
			})
			.catch((err) => setError(err.message));
	};

	return (
		<div className="signup">
			<h2>Signup</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleSignup}>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Signup</button>
			</form>
		</div>
	);
}

export default Signup;
