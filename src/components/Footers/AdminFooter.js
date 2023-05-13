import React from "react";
import { Link } from 'react-router-dom';
// react-bootstrap components
import { Container } from "react-bootstrap";

function AdminFooter() {
return (
	<>
	<footer className="footer">
		<Container fluid className="pl-4 ml-2">
		<nav className="text-white text-right">
			{/* <p className="copyright text-center"> © <script>document.write(new Date().getFullYear())</script> <Link to="/">Deskillz</Link></p> */}
			<p className="footer-paragraphe-admin">Copyright <script>document.write(new Date().getFullYear())</script>  &copy; <Link to="/">Deskillz</Link> | All Rights Reserved (Designed by ArhamSoft (Pvt) Ltd.)</p>
		</nav>
		</Container>
	</footer>
	</>
);
}

export default AdminFooter;
