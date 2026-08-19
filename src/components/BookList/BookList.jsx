import BookCard from "../BookCard/BookCard.jsx";
import './BookList.css'
function BookList({ books }) {
	return (
		<div className="book-list">
			{books.map((book) => (
				<BookCard key={book.key} book={book}/>
			))}
		</div>
	);
}

export default BookList;
