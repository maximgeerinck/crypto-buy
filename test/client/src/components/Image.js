import React, {Component} from 'react';

export default class Image extends Component {

    render() {

        const { src, alt } = this.props;

        return (
            <img src={ "//staging.api.wallstilldawn.com/assets/" + src } alt={alt}/>
        )
    }

}