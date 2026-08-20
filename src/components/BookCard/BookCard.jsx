import "./BookCard.css";
function BookCard({ book, onFavorite, favorites = [] }) {
	const cover = book.cover_i
		? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
		: "https://via.placeholder.com/150";

	const isFavorite = favorites.some((fav) => fav.key === book.key); // Loops thru the favorites array and checks if the book key and fav id are the same

	return (
		<div className="book-card">
			<div className="series-position">
				{book.series_position
					? `#${book.series_position} in series`
					: `Standalone`}
			</div>
			<h2 className="series-name">
				{book.series_name ? `Series: ${book.series_name}` : "Not in series"}
			</h2>
			<img src={cover} alt={book.title} className="book-image" />
			<h3 className="book-title">{book.title}</h3>
			<p className="publishing-year">{book.first_publish_year}</p>
			<h4 className="book-author">
				{book.author_name ? book.author_name[0] : "Author unknown"}
			</h4>
					{/* If the ebook access is public or borrowable, open the ebook page */}
			{(book.ebook_access === "public" || book.ebook_access === "borrowable") &&
				book.ia && (
					<a
						href={`https://archive.org/details/${book.ia[0]}`}
						target="_blank"
						rel="noopener noreferrer"
						className="epub-link"
					>
						📓 EPUB
					</a>
				)}
				{/* If there's an isbn on amazon, show the link but if not open it on open library */}
			{book.isbn && book.isbn.length > 0 ? (
				<a
					href={`https://www.amazon.com/s?k=${book.isbn[0]}`}
					target="_blank"
					rel="noopener noreferrer"
					className="purchase-link"
				>
					🛒 Purchase
				</a>
			) : (
				<a
					href={`https://openlibrary.org${book.key}`}
					target="_blank"
					rel="noopener noreferrer"
					className="purchase-link"
				>
					📖 Open Library
				</a>
			)}

			<p className="ebook">{`Ebook availability: ${book.ebook_access}`}</p>

			{book.language ? (
				<div className="languages-container">
					Languages:
					{book.language.map((lang, idx) => (
						<div key={idx} className="language">
							{lang}
						</div>
					))}
				</div>
			) : (
				"No language indicated"
			)}

			<button
				className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
				onClick={() => onFavorite(book)}
			>
				{isFavorite ? "★" : " ☆"}
			</button>
		</div>
	);
}

export default BookCard;
