import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Menu extends Component {
  render() {
	return (
	  <div className="App">
		<header className="App-header">

		</header>
		<div className="App-intro">

			<nav className="col-md-2 d-none d-md-block bg-light sidebar">
			  <div className="sidebar-sticky">
				<ul className="nav flex-column">
					<li className="nav-item">
	                <a className="nav-link" href="/">
	                  <span data-feather="home"></span>
	                  Dashboard
	                </a>
	              </li>
				  <li className="nav-item">
				  	<NavLink className="nav-link" to="/inicio"><i className="fa fa-home"></i>
					  &nbsp;Inicio</NavLink>
				  </li>
				  <li className="nav-item">
				  	<NavLink className="nav-link" to="/clientes" activeClassName="active"><i className="fa fa-users"></i>
					  &nbsp;Clientes</NavLink>
				  </li>
				  
				  <li className="nav-item">
				  	<NavLink className="nav-link" to="/productos" activeClassName="active"><i className="fa fa-shopping-cart"></i>
					  &nbsp;Productos</NavLink>
				  </li>

				  <li className="nav-item">
				  	<NavLink className="nav-link" to="/ventas" activeClassName="active"><i className="fa fa-file"></i>
					  &nbsp;Ventas</NavLink>
				  </li>
				  
				</ul>

				
			  </div>
			</nav>

		</div>
	  </div>
	);
  }
}

export default Menu;
