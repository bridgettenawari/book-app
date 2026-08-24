import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import Books from "./pages/Books/Books";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Footer from "./components/Footer/Footer";

function App() {
	const [favorites, setFavorites] = useState([]);
	const [reading, setReading] = useState([]);
	const [wantToRead, setWantToRead] = useState([]);
	const [read, setRead] = useState([]);

	const toggleFavorite = (book) => {
		setFavorites((prev) =>
			prev.find((fav) => fav.key === book.key)
				? prev.filter((fav) => fav.key !== book.key)
				: [...prev, book],
		);
	};

	const handleStatusChange = (book, status) => {
		// Remove book from all previous lists first
		setWantToRead((prev) => prev.filter((b) => b.key !== book.key));
		setRead((prev) => prev.filter((b) => b.key !== book.key));
		setReading((prev) => prev.filter((b) => b.key !== book.key));

		// Add to list
		if (status === "want") setWantToRead((prev) => [...prev, book]);
		if (status === "read") setRead((prev) => [...prev, book]);
		if (status === "reading") setReading((prev) => [...prev, book]);
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
						<NavLink to="/login" className="navlink">
							Login
						</NavLink>
						<NavLink to="/signup" className="navlink">
							Signup
						</NavLink>
					</nav>
				</header>
				<main className="main-content">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route
							path="/books"
							element={
								<Books
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

						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
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
