import { NavLink, Routes, Route } from "react-router-dom";
import Books from "../Books/Books";
import "./AllBooks.css";

function AllBooks({
	favorites,
	wantToRead,
	read,
	reading,
	onFavorite,
	onStatusChange,
	user
}) {
	return (
		<div className="books-wrapper">
			<nav className="books-tabs">
				<NavLink to="/books" className="tab-link">
					All Books
				</NavLink>
				<NavLink to="/books/kenya" className="tab-link">
					Kenyan Books
				</NavLink>
			</nav>

			<Routes>
				<Route
					path="/"
					element={
						<Books
							endpoint="/books"
							favorites={favorites}
							wantToRead={wantToRead}
							read={read}
							reading={reading}
							onFavorite={onFavorite}
							onStatusChange={onStatusChange}
							user = {user}
						/>
					}
				/>
				<Route
					path="/kenya"
					element={
						<Books
							endpoint="/books/kenya"
							favorites={favorites}
							wantToRead={wantToRead}
							read={read}
							reading={reading}
							onFavorite={onFavorite}
							onStatusChange={onStatusChange}
							user = {user}
						/>
					}
				/>
			</Routes>
		</div>
	);
}

export default AllBooks;
