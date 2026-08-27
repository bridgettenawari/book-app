import { useState } from "react";
import BookCard from "../../components/BookCard/BookCard.jsx";
import "./Favorites.css";
import "../../components/BookList/BookList.css";

function Favorites({
	favorites = [],
	wantToRead = [],
	read = [],
	reading = [],
	onFavorite,
	onStatusChange,
}) {
	const [showAllFavorites, setShowAllFavorites] = useState(false);
	const [showAllWant, setShowAllWant] = useState(false);
	const [showAllRead, setShowAllRead] = useState(false);
	const [showAllReading, setShowAllReading] = useState(false);

	const renderSection = (title, books, showAll, setShowAll) => (
		<section className="favorites-section">
			<h2>{title}</h2>
			{books.length === 0 ? (
				<p>No books here.</p>
			) : (
				<>
					<div className="book-list">
						{/* Show only the first 6 books */}
						{(showAll ? books : books.slice(0, 6)).map((book) => (
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
					{books.length > 6 && (
						<button
							className="show-more-btn"
							onClick={() => setShowAll(!showAll)}
						>
							{showAll ? "Show Less" : "Show More"}
						</button>
					)}
				</>
			)}
		</section>
	);

	return (
		<div className="favorites-page">
			{renderSection(
				" ★ Favorites",
				favorites,
				showAllFavorites,
				setShowAllFavorites,
			)}
			{renderSection("⏱ Want to Read", wantToRead, showAllWant, setShowAllWant)}
			{renderSection("✓ Read", read, showAllRead, setShowAllRead)}
			{renderSection(
				"⌛︎ Currently Reading",
				reading,
				showAllReading,
				setShowAllReading,
			)}
		</div>
	);
}

export default Favorites;
