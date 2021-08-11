import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './BrandGroup.scss';

function BrandGroup(props) {
    return (
        <Container className="brand-group">
            {
                props.data.map((value, index) => (
                    <div key={index}>
                        <Row id={value.group}>
                            <Col md={1} className="group">
                                <div>
                                    {value.group}
                                </div>
                            </Col>
                            <Col md={11} className="list">
                                <div>
                                    {value.children.map((childValue, childIndex) => (
                                        <Link key={childIndex} to="/">{childValue.name}</Link>
                                    ))
                                    }
                                </div>
                            </Col>
                        </Row>
                        <div className="margin-global-top-2" />
                    </div>
                ))
            }
        </Container>
    );
}

export default BrandGroup;