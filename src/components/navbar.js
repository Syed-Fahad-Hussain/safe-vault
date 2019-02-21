import React, { Component } from 'react';
import logo from '../images/logo.png';
import {Row, Col} from 'react-materialize';

class CustomNavbar extends Component {

    render() {
        return (
            <nav style={{backgroundColor: '#ffffff'}}>
            <div className="nav-wrapper">
              <img src={logo} alt='logo' style={{width: "160px"}}/>
              <a href="#" className="brand-logo center" style={{fontSize:'1em', color: '#89129E'}}>Save your valuable data and documents to the blockchain with one click.</a>
                {/* <ul id="nav-mobile" className="right hide-on-med-and-down">
                  <li><a href="sass.html">Sass</a></li>
                  <li><a href="badges.html">Components</a></li>
                  <li><a href="collapsible.html">JavaScript</a></li>
                </ul> */}
            </div>
          </nav>
        )
    }
}


export default (CustomNavbar);
