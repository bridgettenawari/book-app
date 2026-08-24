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
								Button
							</Link>
						</button>
					</div>
				</div>
				<div className="home-image">
					<img
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4LVsfkwq5fWWTdmjlnfclfetbEnLMvbCEjO05xmd_2w&s=10"
						alt="Book image 1"
					/>
					<img
						src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmRRhAUuz3jCsnXBkvNSoNgR22wnF7EHJXufCikG-aXA&s=10"
						alt="Book image 2"
					/>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
