import { useState, useEffect } from "react";
import BookList from "../../components/BookList/BookList";
import "./Books.css";

function Books({
	favorites = [],
	wantToRead = [],
	read = [],
	reading = [],
	onStatusChange,
	onFavorite,
}) {
	const [books, setBooks] = useState([]);
	const [search, setSearch] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);

	const toggleFavorite = (book) => {
		setFavorites((prev) =>
			prev.find((fav) => fav.key === book.key)
				? prev.filter((fav) => fav.key !== book.key)
				: [...prev, book],
		);
	};

	// useEffect for homepage
	useEffect(() => {
		fetch(`https://openlibrary.org/search.json?q=girl&limit=30&page=${page}`) // Set the original to a random search term
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status}`);
				return res.json();
			})
			.then((data) => {
				setLoading(false);
				setError(null);
				setBooks(data.docs);
			})
			.catch((err) => {
				setLoading(false);
				setError(err.message);
			});
		// only need to clean up useEffect when using timers, event listeners e.t.c
	}, [page]); // updates DOM when page is updated

	// useEffect for searching
	useEffect(() => {
		if (!search) return; // Skips if nothing has been searched for
		fetch(
			`https://openlibrary.org/search.json?q=${search}&limit=30&page=${page}`,
		)
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status}`);
				return res.json();
			})
			.then((data) => {
				setLoading(false);
				setError(null);
				setBooks(data.docs);
				setSearch("");
			})
			.catch((err) => {
				setLoading(false);
				setError(err.message);
			});
	}, [search, page]); // only updates DOM when search or page is updated

	return (
		<div className="books">
			<BookList
				loading={loading}
				error={error}
				books={books}
				onFavorite={onFavorite}
				favorites={favorites}
				onStatusChange={onStatusChange}
				wantToRead={wantToRead}
				read={read}
				reading={reading}
			/>
			<div className="pagination-container">
				<button
					className="prev-page-btn"
					onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					disabled={page === 1}
				>
					←
				</button>
				<span className="page-indicator">Page {page}</span>
				<button className="next-page-btn" onClick={() => setPage(page + 1)}>
					→
				</button>
			</div>
		</div>
	);
}

export default Books;
