import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import LinkWithDash from "../LinkWithDash";
import Image from "react-bootstrap/Image";
import logo from "../../assets/img/logo.png";


export default function NavBar() {
	return (
		<Navbar expand="md" style={{
			boxShadow: "0px 5px 9px 0px rgb(0 0 0 / .15)",

		}}>
			<Container>
				<Navbar.Brand as={Link} to="/" className="text-primary typewriter-brand">
					<span><Image id="logo" src={logo} />Arquivo Censurado</span>
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="navbar" />
				<Navbar.Collapse id="navbar" className="justify-content-end gap-3">
					<Nav>
						{/* TODO: instead of black put text.primary.color */}
						<li><LinkWithDash component={NavLink} style={{
							margin: "var(--bs-navbar-nav-link-padding-x)",
							color: "black",
						}} to="/">Home</LinkWithDash></li>
						<li><LinkWithDash component={NavLink} style={{
							margin: "var(--bs-navbar-nav-link-padding-x)",
							color: "black",
						}} to="/about">Sobre</LinkWithDash></li>
						<li><LinkWithDash component={NavLink} style={{
							margin: "var(--bs-navbar-nav-link-padding-x)",
							color: "black",
						}} to="/faq">FAQ</LinkWithDash></li>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
