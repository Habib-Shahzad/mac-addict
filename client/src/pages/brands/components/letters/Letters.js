import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Letters.scss';

function Letters(props) {
    const onClick = id => {
        document.getElementById(`${id}`).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    return (
        <Container className='letters'>
            <Row>
                <Col className="justify-content-center">
                {
                    props.data.map((value, index) => (
                        <p onClick={e => onClick(value.group)} key={index}>{value.group}</p>
                    ))
                }
                </Col>
            </Row>
        </Container>
    );
}

export default Letters;