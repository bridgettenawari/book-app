import BookCard from "../BookCard/BookCard.jsx";
import "./BookList.css";
function BookList({
	loading,
	error,
	books,
	onFavorite,
	favorites,
	onStatusChange,
	wantToRead,
	read,
	reading,
}) {
	return (
		<div className="book-list">
			{/* When mapping, after the arrow always use normal brackets not curly brackets */}
			{loading && (
				<div>
					<div className="spinner">↻</div>loading...
				</div>
			)}
			{error && <div className="error-message">Error: {error} </div>}
			{books.map((book) => (
				<BookCard
					key={book.key}
					book={book}
					onFavorite={onFavorite}
					favorites={favorites}
					onStatusChange={onStatusChange}
					wantToRead={wantToRead}
					read={read}
					reading={reading}
				/> /*Always sset the id as the key*/
			))}
		</div>
	);
}

export default BookList;
