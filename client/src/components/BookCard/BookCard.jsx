import "./BookCard.css";
import { useState } from "react";

function BookCard({
	book,
	onStatusChange,
	onFavorite,
	favorites = [],
	wantToRead = [],
	read = [],
	reading = [],
}) {
	const [showLanguages, setShowLanguages] = useState(false);

	const cover = book.cover_i
		? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
		: "https://via.placeholder.com/150";
	const isFavorite = favorites.some((fav) => fav.key === book.key);

	let currentStatus = "";
	if (wantToRead.some((wtr) => wtr.key === book.key)) currentStatus = "want";
	else if (read.some((rd) => rd.key === book.key)) currentStatus = "read";
	else if (reading.some((r) => r.key === book.key)) currentStatus = "reading";
	else currentStatus = "want";

	const languages = book.language || [];
	const mainLanguages = languages.slice(0, 3); // Only shows the first three languages
	const extraLanguages = languages.slice(3); // Starts from the index that was cut off

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

			{/* <p className="ebook">{`Ebook availability: ${book.ebook_access}`}</p> */}

			{languages.length > 0 ? (
				<div className="languages-container">
					Languages:
					{mainLanguages.map((lang, i) => (
						<div key={i} className="language">
							{lang}
						</div>
					))}
					{extraLanguages.length > 0 && (
						<>
							{!showLanguages && (
								<button
									className="language language-toggle"
									onClick={() => setShowLanguages(true)}
								>
									...
								</button>
							)}
							{showLanguages && (
								<>
									{extraLanguages.map((lang, i) => (
										<div key={i} className="language">
											{lang}
										</div>
									))}
									<button
										className="language language-toggle"
										onClick={() => setShowLanguages(false)}
									>
										Hide
									</button>
								</>
							)}
						</>
					)}
				</div>
			) : (
				"No language indicated"
			)}

			<div className="book-actions">
				<select
					className="status-dropdown"
					value={currentStatus}
					onChange={(e) => onStatusChange(book, e.target.value)}
				>
					<option value="want">📖 Want to Read</option>
					<option value="reading">📚 Currently Reading</option>
					<option value="read">✅ Read</option>
				</select>

				<button
					className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
					onClick={() => onFavorite(book)}
				>
					{isFavorite ? "★" : "☆"}
				</button>
			</div>
		</div>
	);
}

export default BookCard;
