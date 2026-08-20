import { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	BrowserRouter,
	NavLink,
} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import BookList from "./components/BookList/BookList";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
	const [books, setBooks] = useState([]); 
	const [search, setSearch] = useState();
	const [error, setError] = useState(null);

	// useEffect for homepage
	useEffect(() => {
		fetch("https://openlibrary.org/search.json?q=girl&limit=40") // Set the original to a random search term
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status}`);
				return res.json();
			})
			.then((data) => {
				setBooks(data.docs);
			})
			.catch((err) => setError(err.message));
			// only need to clean up useEffect when using timers, event listeners e.t.c
	}, []); // only runs on mount

	// useEffect for searching
	useEffect(() => {
		if (!search) return; // Skips if nothing has been searched for
		fetch(`https://openlibrary.org/search.json?q=${search}&limit=40`) 
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status}`);
				return res.json();
			})
			.then((data) => {
				setBooks(data.docs);
			})
			.catch((err) => setError(err.message));
	}, [search]); // only updates DOM when search is updated

	return (
		<div>
			<BrowserRouter>
				<NavigationBar onSearch={setSearch} />
				<NavLink className="navlinks" to="/">
					🏠︎ Home
				</NavLink>
				<NavLink className="navlinks" to="/books">
					🗒 Books
				</NavLink>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/books" element={<BookList books={books} />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
