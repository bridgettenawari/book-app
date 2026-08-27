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
import { apiGet, apiPost, apiDelete } from "./Api.js";

function App() {
	// books
	const [favorites, setFavorites] = useState([]);
	const [reading, setReading] = useState([]);
	const [wantToRead, setWantToRead] = useState([]);
	const [read, setRead] = useState([]);

	//users
	const [user, setUser] = useState(null);

	// Checks if user is logged in
	useEffect(() => {
		apiGet("/check")
			.then((data) => {
				if (data && data.id) {
					setUser(data);
				} else {
					setUser(null);
				}
			})
			.catch(() => setUser(null));
	}, []);

	const handleLogin = (userData) => {
		setUser(userData);
	};

	const handleLogout = () => {
		apiDelete("/logout")
			.then(() => {
				setUser(null);
				alert("Logged out!");
			})
			.catch((err) => console.error(err.message));
	};

	const handleSignup = (userData) => {
		setUser(userData);
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
					console.error(null);
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
				console.error(null);
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
						<NavLink to="/favorites" className="navlink">
							✩ Favorites
						</NavLink>
						<NavLink to="/recent" className="navlink">
							🕰 Recently viewed
						</NavLink>
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
							<>
								<button onClick={handleLogout} className="logout-btn">
									Logout
								</button>
								{user && <span className="user-name">{user.username}</span>}
							</>
						)}
					</nav>
				</header>
				<main className="main-content">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route
							path="/books/*"
							element={
								<AllBooks
									favorites={favorites}
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
