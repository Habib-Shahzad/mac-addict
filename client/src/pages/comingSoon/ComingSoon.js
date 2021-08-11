import React from 'react';
import { Container } from 'react-bootstrap';
import './ComingSoon.scss'

function ComingSoon(props) {
    return (
        <Container className="coming-soon" fluid>
            {/* <div className="insta-box unhide-992">
                <a className="insta" rel="noreferrer" target="_blank" href="https://instagram.com/macaddict848?utm_medium=copy_link">
                    <i className="fa fa-instagram" />
                </a>
            </div> */}
            {/* <Container fluid> */}
                <div className="insta-box hide-992s">
                    <a className="insta" rel="noreferrer" target="_blank" href="https://instagram.com/macaddict848?utm_medium=copy_link">
                        <i className="fa fa-instagram" />
                    </a>
                </div>
                <div className="justify-content-center logo-cont">
                    <img className="logo img-flud" src="/logo.png" alt="MAC Addict" />
                </div>
                {/* <Row className="justify-content-center"> */}
                    <div className="message">
                        Coming Soon
                    </div>
                {/* </Row> */}
                {/* <Row className="justify-content-center"> */}
                    <div className="powered-by">
                        <p>Powered By</p>
                        <a href="https://www.instagram.com/hexandbracket/" target="_blank" rel="noreferrer">
                            <img className="h-b-logo" src="h-b-logo.png" alt="hex & bracket" />
                        </a>
                    </div>
                {/* </Row> */}
            {/* </Container> */}
        </Container>
    );
}

export default ComingSoon;