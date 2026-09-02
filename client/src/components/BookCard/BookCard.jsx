import "./BookCard.css";
import Notes from "../Notes/Notes";
import PopupCard from "../PopupCard/PopupCard";
import { useState } from "react";

function BookCard({
	book,
	onStatusChange,
	onFavorite,
	favorites = [],
	wantToRead = [],
	read = [],
	reading = [],
	user,
}) {
	const [showLanguages, setShowLanguages] = useState(false);
	const [showPopup, setShowPopup] = useState(false);

	const cover = book.cover_i
		? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
		: "https://via.placeholder.com/150";

	const isFavorite = favorites.some((fav) => fav.id === book.id);

	let currentStatus = "";
	if (wantToRead.some((b) => b.id === book.id)) currentStatus = "want";
	else if (reading.some((b) => b.id === book.id)) currentStatus = "reading";
	else if (read.some((b) => b.id === book.id)) currentStatus = "read";

	const languages = book.language || [];
	const mainLanguages = languages.slice(0, 3);
	const extraLanguages = languages.slice(3);

	// Show popup if not logged in and user tries to add to favorites or change status
	const handleFavoriteClick = () => {
		if (!user) {
			setShowPopup(true);
			return;
		}
		onFavorite(book);
	};

	const handleStatusChange = (e) => {
		if (!user) {
			setShowPopup(true);
			return;
		}
		onStatusChange(book, e.target.value);
	};

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
				{book.author_name
					? book.author_name[0]
					: book.author || "Author unknown"}
			</h4>

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
				<div className="languages-container">No language indicated</div>
			)}

			{/* NOTES*/}
			<Notes bookId={book.id} user={user} setShowPopup={setShowPopup}/>

			<div className="book-actions">
				<select
					className="status-dropdown"
					value={currentStatus}
					onChange={handleStatusChange}
				>
					<option value="" disabled>
						Set status...
					</option>
					<option value="want">⏱ Want to Read</option>
					<option value="reading">⌛︎ Currently Reading</option>
					<option value="read">✓ Read</option>
				</select>

				<button
					className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
					onClick={handleFavoriteClick}
				>
					{isFavorite ? "★" : "☆"}
				</button>
			</div>
			{showPopup && (
				<Popup
					message="Signup or login to perform this action!"
					onClose={() => setShowPopup(false)}
				/>
			)}
		</div>
	);
}

export default BookCard;
