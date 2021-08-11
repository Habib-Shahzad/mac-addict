import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './IconBanner.scss';

function IconBanner(props) {
    return (
        <Container fluid className="icon-banner">
            <Row className="justify-content-center">
                <Col md={1}>
                    <a className="icon-cont" href="/">
                        <i className="center-relative-horizontal fa fa-facebook-f"></i>
                    </a>
                </Col>
                <Col md={1}>
                    <a className="icon-cont" href="/">
                        <i className="center-relative-horizontal fa fa-instagram"></i>
                    </a>
                </Col>
                <Col md={1}>
                    <a className="icon-cont" href="/">
                        <i className="center-relative-horizontal fa fa-whatsapp"></i>
                    </a>
                </Col>
            </Row>
        </Container>
    );
}

export default IconBanner;