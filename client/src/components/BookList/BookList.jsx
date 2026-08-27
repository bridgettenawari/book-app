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
  if (loading) {
    return (
      <div className="book-list-status">
        <div className="spinner">↻</div>loading...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!books || books.length === 0) {
    return <div className="book-list-status">No books found.</div>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onFavorite={onFavorite}
          favorites={favorites}
          onStatusChange={onStatusChange}
          wantToRead={wantToRead}
          read={read}
          reading={reading}
        />
      ))}
    </div>
  );
}

export default BookList;
