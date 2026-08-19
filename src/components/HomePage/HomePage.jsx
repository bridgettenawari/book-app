import "./HomePage.css";
function HomePage() {
	return (
		<div className="homepage">
			<h1 className="home-title">Welcome to Loco for Literature</h1>
			<p className="home-message">Your favourite book archive</p>
			<img
				className="home-book-image"
				src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL2fXTybHERglZmGbNrhX9y5NXhDALazkGbQ&s"
				alt="book"
			/>
			<div className="authorization">
				<button className="signup">Sign Up</button>
				<button className="login">Login</button>
			</div>
			<div className="contacts">
				<p className="contacts-text">Contact me:</p>
				<p className="phone"><a className="phone" href="tel:+254712345678">☏ +254712345678</a></p>
        <p className="email"><a className="email" href="mailto:loco@domain.com">✉ loco@domain.com</a></p>

			</div>
		</div>
	);
}

export default HomePage;
