import { useState, useEffect } from "react";
import BookCard from "../../components/BookCard/BookCard.jsx";
import { apiGet } from "../../Api";
import "./RecentlyViewed.css";

function RecentlyViewed({
	favorites = [],
	wantToRead = [],
	read = [],
	reading = [],
	onFavorite,
	onStatusChange,
}) {
	const [recentBooks, setRecentBooks] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		apiGet("/recent")
			.then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					setError(null);
					setRecentBooks(data);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return (
		<div className="recent-page">
			<h2 className="recent-title">🕰 Recents</h2>
			{loading && <div>Loading...</div>}
			{error && <div className="error-message">Error: {error}</div>}
			{!loading && !error && recentBooks.length === 0 ? (
				<p>You haven’t viewed any books yet. Browse books to get started.</p>
			) : (
				<div className="book-list">
					{recentBooks.map((book) => (
						<BookCard
							key={book.id}
							book={book}
							onFavorite={onFavorite}
							onStatusChange={onStatusChange}
							favorites={favorites}
							wantToRead={wantToRead}
							read={read}
							reading={reading}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default RecentlyViewed;
