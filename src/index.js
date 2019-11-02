import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Menu from './components/Menu';
import Clients from './components/Clients';
import Products from './components/Products';
import Sales from './components/Sales';

ReactDOM.render(
    <Router>
        <div>
            <Menu/>

            <Route exact path="/" component={App} />
            <Route exact path="/home" component={App} />
            <Route path="/clients" component={Clients} />
            <Route path="/products" component={Products} />
            <Route path="/sales" component={Sales} />

        </div>
    </Router>,
    document.getElementById('root')
)

registerServiceWorker();
