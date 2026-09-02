import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import AllBooks from "./pages/AllBooks/AllBooks";
import Favorites from "./pages/Favorites/Favorites";
import RecentlyViewed from "./pages/RecentlyViewed/RecentlyViewed";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Footer from "./components/Footer/Footer";
import { apiGet, apiPost, apiDelete, getToken, clearToken } from "./Api.js";

function App() {
	// books
	const [favorites, setFavorites] = useState([]);
	const [reading, setReading] = useState([]);
	const [wantToRead, setWantToRead] = useState([]);
	const [read, setRead] = useState([]);
	const [message, setMessage] = useState(null);

	//users
	const [user, setUser] = useState(null);

	// Checks if user is logged in (if there's a JWT token)
	useEffect(() => {
		if (!getToken()) {
			setUser(null);
			return;
		}
		apiGet("/check")
			.then((data) => {
				if (data && data.id) {
					setUser(data);
				} else {
					setUser(null);
					clearToken();
				}
			})
			.catch(() => {
				setUser(null);
				clearToken();
			});
	}, []);

	const handleLogin = (userData) => {
		setUser(userData);
		setMessage("Logged in successfully!");
		setTimeout(() => {
			setMessage(null);
		}, 3000); // Disappears after 3 seconds
	};

	const handleLogout = () => {
		apiDelete("/logout")
			.then(() => {
				clearToken();
				setUser(null);
				setMessage("Logged out!");
				setTimeout(() => {
					setMessage(null);
				}, 3000);
			})
			.catch((err) => console.error(err.message));
	};

	const handleSignup = (userData) => {
		setUser(userData);
		setMessage("Signed up successfully!");
		setTimeout(() => {
			setMessage(null);
		}, 3000);
	};

	// Loads the logged-in user's lists
	const loadLists = () => {
		Promise.all([
			apiGet("/favorites"),
			apiGet("/want"),
			apiGet("/reading"),
			apiGet("/read"),
		])
			.then(([favoritesData, wantData, readingData, readData]) => {
				setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
				setWantToRead(Array.isArray(wantData) ? wantData : []);
				setReading(Array.isArray(readingData) ? readingData : []);
				setRead(Array.isArray(readData) ? readData : []);
			})
			.catch((err) => console.error(err.message));
	};

	useEffect(() => {
		loadLists();
	}, []);

	const toggleFavorite = (book) => {
		apiPost(`/books/${book.id}/favorite`)
			.then((data) => {
				if (data.error) {
					console.error(data.error);
				} else {
					setFavorites(data);
				}
			})
			.catch((err) => console.error(err.message));
	};

	const handleStatusChange = (book, status) => {
		apiPost(`/books/${book.id}/${status}`)
			.then((data) => {
				if (data.error) {
					console.error(data.error);
					return;
				}
				if (status === "want") setWantToRead(data);
				if (status === "reading") setReading(data);
				if (status === "read") setRead(data);
				loadLists();
			})
			.catch((err) => console.error(err.message));
	};

	return (
		<div className="app">
			<BrowserRouter>
				<header className="header">
					<nav className="nav-links">
						<NavLink to="/" className="navlink">
							🏠︎ Home
						</NavLink>
						<NavLink to="/books" className="navlink">
							🗒 Books
						</NavLink>
						{/* If the user is logged in, load favorites page and recents page */}
						{user && (
							<>
								<NavLink to="/favorites" className="navlink">
									✩ Favorites
								</NavLink>
								<NavLink to="/recent" className="navlink">
									🕰 Recents
								</NavLink>
							</>
						)}

						{/* If the user is not logged in, show login and signup links, otherwise show the username and pfp and a logout button */}
						{!user ? (
							<>
								<NavLink to="/login" className="navlink">
									Login
								</NavLink>
								<NavLink to="/signup" className="navlink">
									Signup
								</NavLink>
							</>
						) : (
							<div className="user-info">
								{user && <div className="user-details">
									<img className="user-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyAUuPXSkqhULddUHjyU8SY6stPRu0ZC3DWBu7qfwRsg&s=10" alt="user-image" />
									{user.username}</div>}

									<button onClick={handleLogout} className="logout-btn">
									Logout
								</button>
							</div>
						)}
					</nav>
				</header>
				{message && <div className="app-message">{message}</div>}
				<main className="main-content">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route
							path="/books/*"
							element={
								<AllBooks
									favorites={favorites}
									user={user} // Pass the user state for the signin popup
									wantToRead={wantToRead}
									read={read}
									reading={reading}
									onFavorite={toggleFavorite}
									onStatusChange={handleStatusChange}
								/>
							}
						/>
						<Route
							path="/favorites"
							element={
								<Favorites
									favorites={favorites}
									user = {user}
									wantToRead={wantToRead}
									read={read}
									reading={reading}
									onFavorite={toggleFavorite}
									onStatusChange={handleStatusChange}
								/>
							}
						/>
						<Route
							path="/recent"
							element={
								<RecentlyViewed
									favorites={favorites}
									user = {user}
									wantToRead={wantToRead}
									read={read}
									reading={reading}
									onFavorite={toggleFavorite}
									onStatusChange={handleStatusChange}
								/>
							}
						/>
						<Route path="/login" element={<Login onLogin={handleLogin} />} />
						<Route
							path="/signup"
							element={<Signup onSignup={handleSignup} />}
						/>
					</Routes>
				</main>
				<footer>
					<Footer />
				</footer>
			</BrowserRouter>
		</div>
	);
}

export default App;
