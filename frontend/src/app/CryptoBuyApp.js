import React, { Component } from 'react';
import { Router } from 'react-router'
import routes from '../routes';

import './index.scss';

class ImageRotatorApp extends Component {
    render() {

        const { history } = this.props;

        return (            
            <Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>            
        );
    }
}

export default ImageRotatorApp;
