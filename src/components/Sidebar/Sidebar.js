import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import { getAdmin } from "views/Admin/Admin.action";
import { useSelector, useDispatch} from "react-redux";
import { permissionsForComponents } from '../../utils/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LogoD from "../../assets/img/d-logo.png"
import Logo from "../../assets/img/logo-teext.png"
var CryptoJS = require("crypto-js");
// react-bootstrap components
import {Collapse,Nav} from "react-bootstrap";

function Sidebar({ routes, image, background }) {
// to check for active links and opened collapses
let location = useLocation();
// this is for the user collapse
const [userCollapseState, setUserCollapseState] = React.useState(false);
// this is for the rest of the collapses
const [state, setState] = React.useState({});
const [permissions, setPermissions] = React.useState({})
const [adminRoutes, setRoutes] = React.useState([])
const dispatch = useDispatch()
const getRoleRes = useSelector(state => state.role.getRoleRes)

React.useEffect(()=>{
	let roleEncrypted = localStorage.getItem('role');
	let role = ''
	if (roleEncrypted) {
		let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
		role = roleDecrypted
	}
	// dispatch(getRole(role))

},[])


React.useEffect(()=>{
	if (Object.keys(getRoleRes).length > 0) {
		setPermissions(getRoleRes.role)
		// 
	}
},[getRoleRes])

React.useEffect(()=>{
	if(permissions && Object.keys(permissions).length > 0 || true){

		// separate those permissions which are false for admin
		let rolesNotPermitted =  getRolesNotPermitted(permissions)

		// Based on the permissions, separate those routes/components which admin is not allowed to view
		let routesNotPermitted = getRoutesNotPermitted(rolesNotPermitted)

		// if a route contains submenus and any of the submenu is not allowed to be viewed then remove it
		var filteredRoutes = routes.map(function(route){
			if(route.collapse){
				route.submenus = route.submenus.filter((submenu) => !routesNotPermitted.includes(submenu.name));
			}
			return route;
		});

		// After submenus, filter main routes from array which are not allowed to be viewed by admin
		filteredRoutes = filteredRoutes.filter(function (route) {
			if(route.collapse && route.submenus.length <= 0){
				return null
			}
			// if(!routesNotPermitted.some((r)=> r === route.name)){
				return route
			// }
		});
			
		setRoutes(filteredRoutes)
		
	}
},[permissions])

React.useEffect(() => {
	if(adminRoutes && adminRoutes.length >0){
		setState(getCollapseStates(adminRoutes));
	}
}, [adminRoutes]);

// this creates the intial state of this component based on the collapse routes
// that it gets through routes prop
const getCollapseStates = (routes) => {

	let initialState = {};
	routes.map((prop, key) => {
	if (prop.collapse) {
		initialState = {
		[prop.state]: getCollapseInitialState(prop.submenus),
		...getCollapseStates(prop.submenus),
		...initialState,
		};
	}
	return null;
	});
	return initialState;
};
// this verifies if any of the collapses should be default opened on a rerender of this component
// for example, on the refresh of the page,
// while on the src/submenus/forms/RegularForms.jsx - route /regular-forms
const getCollapseInitialState = (routes) => {
	for (let i = 0; i < routes.length; i++) {
	if (routes[i].collapse && getCollapseInitialState(routes[i].submenus)) {
		return true;
	} else if (location.pathname === routes[i].path) {
		return true;
	}
	}
	return false;
};
// this function creates the links and collapses that appear in the sidebar (left menu)
const createLinks = (routes) => {
	return routes.map((prop, key) => {
	if (prop.redirect) {
		return null;
	}
	if (!prop.showInSideBar) {
		return null;
	}
	if (prop.collapse) {
		var st = {};
		st[prop["state"]] = !state[prop.state];
		return (
		<Nav.Item className={getCollapseInitialState(prop.submenus) ? "active" : ""} as="li" key={key}>
			<Nav.Link className={state[prop.state] ? "collapsed" : "" } data-toggle="collapse" onClick={(e) => { e.preventDefault(); setState({ ...state, ...st }); }} aria-expanded={state[prop.state]}>
				<span className="nav-icon-holder">
					{
						prop.faicon ?
							<FontAwesomeIcon icon={prop.faicon} /> :
							<i className={prop.icon} />
					}
					{/* <i className={prop.icon}></i> */}
				</span>
				<p>
					{prop.name} <b className="caret"></b>
				</p>
			</Nav.Link>
			<Collapse in={state[prop.state]}>
				<div >
					<Nav as="ul">{createLinks(prop.submenus)}</Nav>
				</div>
			</Collapse>
		</Nav.Item>
		);
	}
	return (
		<Nav.Item className={activeRoute(prop.path)} key={key} as="li">
			<Nav.Link  to={prop.path} as={Link}>
				{prop.icon ? (
				<>
					<span className="nav-icon-holder">
						{
							prop.faicon ?
								<FontAwesomeIcon icon={prop.faicon} /> :
								<i className={prop.icon} />
						}
						{/* <i className={prop.icon} /> */}
					</span>
					<p>{prop.name}</p>
				</>
				) : (
				<>
					<span className="nav-icon-holder">
						{/* <span className="sidebar-mini">{prop.mini}</span> */}
						<i className={prop.icon}></i>
					</span>
					<span className="sidebar-normal">{prop.name}</span>
				</>
				)}
			</Nav.Link>
		</Nav.Item>
	);
	});
};
// verifies if routeName is the one active (in browser input)
const activeRoute = (routeName) => {
	return location.pathname === routeName ? "active" : "";
};

const getRolesNotPermitted = (permissions) =>{
	let permissionsNotAllowed = []
	let adminPermissions = []
	for (const [key, value] of Object.entries(permissions)) {
		if(key !== '_id' && key !== 'status' && key!=='title'){
			adminPermissions.push({key : `${key}` ,value : `${value}`})
		}	
	  }
	  adminPermissions.map((per)=>{
		if(per.value === 'false'){
			permissionsNotAllowed.push(per.key)
		}
	  })
	  return permissionsNotAllowed
}

const getRoutesNotPermitted = (rolesNotPermitted) =>{
	let notPermittedRoutes= []
	rolesNotPermitted.map((roleNotPermitted) =>{
		permissionsForComponents.map((perC)=>{
			if(roleNotPermitted === perC.role){
				notPermittedRoutes.push(perC.component)
			}
		})
	})
	return notPermittedRoutes
}

return (
	<>
	<div className="sidebar" data-color={background} data-image={image}>
		<div className="sidebar-wrapper">
			<div className="logo">
				{/* <Link className="logo-mini" to="/">
					<div className="logo-img">
						<img src={require("assets/img/logo.svg").default} alt="Deskillz Logo" />
					</div>
				</Link> */}
				<Link className="simple-text logo-normal" to="dashboard" >
				{/* <img src={require("assets/img/hex-text.svg").default} alt="Deskillz Text Logo" /> */}
				<span className="dlogo"><img src={LogoD} className="dlogo"  alt="Deskillz" /></span>
					<span className="dlogo"><img src={Logo} className='textlogo'  alt="Deskillz" /></span>
				</Link>
			</div>
		{/* <div className="user">
			<div className="photo">
			<img
				alt="..."
				src={require("assets/img/default-avatar.png").default}
			></img>
			</div>
			<div className="info">
			<a
				className={userCollapseState ? "collapsed" : ""}
				data-toggle="collapse"
				href="#pablo"
				onClick={(e) => {
				e.preventDefault();
				setUserCollapseState(!userCollapseState);
				}}
				aria-expanded={userCollapseState}
			>
				<span>
				Tania Andrew <b className="caret"></b>
				</span>
			</a>
			<Collapse id="collapseExample" in={userCollapseState}>
				<div>
				<Nav as="ul">
					<li>
					<a
						className="profile-dropdown"
						href="#pablo"
						onClick={(e) => e.preventDefault()}
					>
						<span className="sidebar-mini">MP</span>
						<span className="sidebar-normal">My Profile</span>
					</a>
					</li>
					<li>
					<a
						className="profile-dropdown"
						href="#pablo"
						onClick={(e) => e.preventDefault()}
					>
						<span className="sidebar-mini">EP</span>
						<span className="sidebar-normal">Edit Profile</span>
					</a>
					</li>
					<li>
					<a
						className="profile-dropdown"
						href="#pablo"
						onClick={(e) => e.preventDefault()}
					>
						<span className="sidebar-mini">S</span>
						<span className="sidebar-normal">Settings</span>
					</a>
					</li>
				</Nav>
				</div>
			</Collapse>
			</div>
		</div> */}
		<Nav as="ul">{createLinks(adminRoutes)}</Nav>
		</div>
	</div>
	</>
);
}

let linkPropTypes = {
path: PropTypes.string,
layout: PropTypes.string,
name: PropTypes.string,
component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

Sidebar.defaultProps = {
image: "",
background: "black",
routes: [],
};

Sidebar.propTypes = {
image: PropTypes.string,
background: PropTypes.oneOf([
	"black",
	"azure",
	"green",
	"orange",
	"red",
	"purple",
])
};

export default Sidebar;
