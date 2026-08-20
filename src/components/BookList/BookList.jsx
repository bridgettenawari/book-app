import BookCard from "../BookCard/BookCard.jsx";
import './BookList.css'
function BookList({ books }) {
	return (
		<div className="book-list">
			{/* When mapping, after the arrow always use normal brackets not curly brackets */}
			{books.map((book) => (
				<BookCard key={book.key} book={book}/> /*Always sset the id as the key*/
			))}
		</div>
	);
}

export default BookList;
