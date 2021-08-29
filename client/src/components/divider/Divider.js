import React from 'react';
import { Col } from 'react-bootstrap';
import './Divider.scss'

function Divider(props) {
    return (
        <Col md={props.md} className={`divider ${props.classes}`}></Col>
    );
}

export default Divider;