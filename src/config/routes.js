import React from 'react';
import {
  Router,
  Route
} from 'react-router-dom';
import CustomNavbar from '../components/navbar'
import Home from '../components/home';
import Read from '../components/read'
import Write from '../components/write'
import createBrowserHistory from 'history/createBrowserHistory';

const customHistory = createBrowserHistory();

const BasicRouting = (props) => {
  return ( 
    <Router history={customHistory}>
    <div>
        <CustomNavbar />
        <Route path="/" component={Home} />
        <Route exact path="/read" component={Read} />
        <Route exact path="/write" component={Write} />

    </div>
    </Router>
  )
}


export default (BasicRouting);