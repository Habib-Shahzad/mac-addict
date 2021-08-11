import React from 'react';
import { Col } from 'react-bootstrap';
import './Banner.scss';

function Banner(props) {
    return (
        <Col md={props.md} className="banner">
            <img src={props.src} alt={props.alt} />
        </Col>
    );
}

export default Banner;