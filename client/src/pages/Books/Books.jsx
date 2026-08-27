import { useState, useEffect } from "react";
import BookList from "../../components/BookList/BookList";
import { apiGet } from "../../Api";
import "./Books.css";

function Books({
	endpoint = "/books",
	favorites = [],
	wantToRead = [],
	read = [],
	reading = [],
	onStatusChange,
	onFavorite,
}) {
	const [books, setBooks] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Reset to page 1 whenever the endpoint changes (switching All/Kenya tabs)
	// or a new search is submitted, so we don't end up on an out-of-range page.
	useEffect(() => {
		setPage(1);
	}, [endpoint, search]);

	// Single effect drives both plain browsing and search.
	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams({ page, per_page: 30 });
		if (search) params.set("q", search);

		apiGet(`${endpoint}?${params.toString()}`)
			.then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					setError(null);
					setBooks(data.books || []);
					setTotalPages(data.total_pages || 1);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [endpoint, page, search]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setSearch(searchInput.trim());
	};

	return (
		<div className="books">
			<form className="search-bar" onSubmit={handleSearchSubmit}>
				<input
					type="text"
					placeholder="Search books by title..."
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				<button type="submit">Search</button>
				{search && (
					<button
						type="button"
						className="clear-search-btn"
						onClick={() => {
							setSearchInput("");
							setSearch("");
						}}
					>
						Clear
					</button>
				)}
			</form>

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

			{!loading && !error && (
				<div className="pagination-container">
					<button
						className="prev-page-btn"
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						disabled={page === 1}
					>
						←
					</button>
					<span className="page-indicator">
						Page {page} of {totalPages}
					</span>
					<button
						className="next-page-btn"
						onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={page >= totalPages}
					>
						→
					</button>
				</div>
			)}
		</div>
	);
}

export default Books;
