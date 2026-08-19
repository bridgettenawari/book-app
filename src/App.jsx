import { useState } from "react";
import "./App.css";
import BookList from "./components/BookList/BookList";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
	return (
		<>
			<NavigationBar />
			<BookList />
		</>
	);
}

export default App;
