import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Menu from './componentes/Menu';
import Clientes from './componentes/Clientes';
import Productos from './componentes/Productos';
import Ventas from './componentes/Ventas';

ReactDOM.render(
	<Router>
		<div>
			<Menu/>

			<Route exact path="/" component={App} />
			<Route exact path="/inicio" component={App} />
			<Route path="/clientes" component={Clientes} />
			<Route path="/productos" component={Productos} />
			<Route path="/ventas" component={Ventas} />

		</div>
	</Router>,
  document.getElementById('root')
)

registerServiceWorker();