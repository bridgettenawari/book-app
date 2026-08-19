import { useEffect, useState } from "react";
import "./App.css";
import BookList from "./components/BookList/BookList";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
	const [books, setBooks] = useState([]);
	const [search, setSearch] = useState();

	// useEffect for homepage
	useEffect(() => {
		fetch('https://openlibrary.org/search.json?q=girl&limit=20') // Set the original to a random search term
		.then((res) => {
			if(!res.ok) throw new Error(`${res.status}`)
			return res.json();
		})
		.then((data) => {
			setBooks(data.docs)
		})
		.catch((err) => console.error(err))
	}, [])

	// useEffect for searching
	useEffect(() => {
		if (!search) return; // Skips if nothing has been searched for
		fetch(`https://openlibrary.org/search.json?q=${search}&limit=20`) 
		.then((res) => {
			if(!res.ok) throw new Error(`${res.status}`)
			return res.json();
		})
		.then((data) => {
			setBooks(data.docs)
		})
		.catch((err) => console.error(err))
	}, [search]) // only updates DOM when search is updated

	return (
		<>
			<NavigationBar onSearch={setSearch}/>
			<BookList books={books}/>
		</>
	);
}

export default App;
