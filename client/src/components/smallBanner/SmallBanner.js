import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './SmallBanner.scss';

function SmallBanner(props) {
    return (
        <Container className="small-banner hide-992" fluid>
            <Row>
                <Col>
                    AVAIL 10% OFF ON YOUR FIRST ORDER - CODE:FIRST10 - T&Cs APPLY
                </Col>
            </Row>
        </Container>
    );
}

export default SmallBanner;