import { useState } from "react";
import "./App.css";
import BookList from "./components/BookList/BookList";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import SideBar from "./components/SideBar/SideBar";

function App() {
	return (
		<>
			<NavigationBar />
			<SideBar />
			<BookList />
		</>
	);
}

export default App;
