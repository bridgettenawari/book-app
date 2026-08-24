import "./Footer.css";
function Footer() {
	return (
		<footer className="contacts">
			<div className="contacts-text">
				<p className="contact-text">Contact me:</p>
				<p className="phone">
					<a className="phone" href="tel:+254712345678" target="_blank">
						☏ +254712345678
					</a>
				</p>
				<p className="email">
					<a className="email" href="mailto:loco@domain.com" target="_blank">
						✉ loco@domain.com
					</a>
				</p>
			</div>
			<p className="copyright">© 2026</p>
		</footer>
	);
}

export default Footer;
