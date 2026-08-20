import BookCard from "../BookCard/BookCard.jsx";
import "./BookList.css";
function BookList({ books, error, onFavorite, favorites }) {
	return (
		<div className="book-list">
			{/* When mapping, after the arrow always use normal brackets not curly brackets */}
			{error && <div className="error-message">Error: {error} </div>}
			{books.map((book) => (
				<BookCard
					key={book.key}
					book={book}
					onFavorite={onFavorite}
					favorites={favorites}
				/> /*Always sset the id as the key*/
			))}
		</div>
	);
}

export default BookList;
