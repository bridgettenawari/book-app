import "./HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
	return (
		<div className="homepage">
			<div className="home-div">
				<div className="home-text">
					<h1 className="home-title">Loco for Literature</h1>
					<p className="home-message">
						“A place for all your book wants and needs.”
					</p>
					<div className="home-buttons">
						<button className="github-btn">
							<a
								className="github-link"
								href="https://github.com/bridgettenawari/book-app.git"
							>
								Github
							</a>
						</button>
						<button className="login-btn">
							<Link className="login-link" to="/login">
								Login
							</Link>
						</button>
					</div>
				</div>
				<div className="home-image">
					<img
						src="https://i.pinimg.com/564x/11/8c/68/118c68aabd2948d1d82b72f6cf5c3f7a.jpg"
						alt="Book image 1"
					/>
					<img
						src ="https://i.pinimg.com/736x/69/17/98/691798326704e2ee2c9a9a8b5562929c.jpg"
						alt="Book image 2"
					/>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
