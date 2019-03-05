import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';

class CustomNavbar extends Component {

    render() {
        return (
            <nav style={{backgroundColor: '#ffffff'}}>
            <div className="nav-wrapper">
              <a href="#" className="brand-logo center" style={{fontSize:'1em', color: '#89129E'}}>Save your valuable data and documents to the blockchain with one click.</a>
            </div>
          </nav>
        )
    }
}


export default (CustomNavbar);
