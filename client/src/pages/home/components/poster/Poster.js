import React from 'react';
import { Container } from 'react-bootstrap';
import './Poster.scss'

function Poster(props) {
    return (
        <Container className="poster">
            <img src="/Background/background.png" alt="Poster" />
        </Container>
    );
}

export default Poster;