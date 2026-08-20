import BookCard from "../BookCard/BookCard.jsx";
import "./Favorites.css";

function Favorites({ favorites, onFavorite }) {
  return (
    <div className="favorites-list">
      <h1 className="fav"> ★Favorites ★</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet. Add some from the Books page!</p>
      ) : (
        favorites.map((book) => (
          <BookCard key={book.key} book={book} onFavorite={onFavorite} />
        ))
      )}
    </div>
  );
}

export default Favorites;
