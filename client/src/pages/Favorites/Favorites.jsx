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
	user,
}) {
	const [showAllFavorites, setShowAllFavorites] = useState(false);
	const [showAllWant, setShowAllWant] = useState(false);
	const [showAllRead, setShowAllRead] = useState(false);
	const [showAllReading, setShowAllReading] = useState(false);

	const showSection = (title, books, showAll, setShowAll) => (
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
								user = {user}
							/>
						))}
					</div>
					{books.length > 6 && (
						<button
							className="show-more-btn"
							onClick={() => setShowAll(!showAll)} // sets it to the opposite of what it was before
						>
							{showAll ? "Show Less" : "Show More"}
						</button>
					)}
				</>
			)}
		</section>
	);

	return (
		// dynamically shows the different sections of the favorites page based on the books in each category
		<div className="favorites-page">
			{showSection(
				" ★ Favorites",
				favorites,
				showAllFavorites,
				setShowAllFavorites,
			)}
			{showSection("⏱ Want to Read", wantToRead, showAllWant, setShowAllWant)}
			{showSection("✓ Read", read, showAllRead, setShowAllRead)}
			{showSection(
				"⌛︎ Currently Reading",
				reading,
				showAllReading,
				setShowAllReading,
			)}
		</div>
	);
}

export default Favorites;
