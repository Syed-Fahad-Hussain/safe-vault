import React from 'react';
import ReactDOM from 'react-dom';
import BasicRouting from './config/routes';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BasicRouting />, document.getElementById('root'));
registerServiceWorker();
