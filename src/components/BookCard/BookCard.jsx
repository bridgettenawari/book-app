import "./BookCard.css";

function BookCard({ book }) {
	const cover = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`; /*The book.cover_i is the image code so your supposed to input it into the cover URL to get the book covers*/

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
			<p className="ebook">{`Ebook availability: ${book.ebook_access}`}</p>
				{/* Since languages are in an array, loop through them to display them individually */}
			{book.language ? (
				<div className="languages-container">
          Languages:
					{book.language.map((lang) => (
						<div className="language">
							{lang}
						</div>
					))}
				</div>
			) : (
				"No language indicated"
			)}
		</div>
	);
}

export default BookCard;
