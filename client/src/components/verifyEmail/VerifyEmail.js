import { Container, Row, Col } from 'react-bootstrap';
import { MainHeading, DescriptionText } from '../../components';


function VerifyEmail() {

    return (
        <Container>
            <div className="margin-global-top-5" />
            <Row>
                <Col>

                    <MainHeading
                        text="Please Verify your email address to continue"
                        classes="text-center"
                    />

                    <MainHeading
                        text="An Email has been sent to you."
                        classes="text-center"
                    />

                    <DescriptionText
                        text="Check your spam folder if you don't see the email in your inbox."
                        to={null}
                        classes="text-center"
                    />

                </Col>
            </Row>


        </Container>
    );

}

export default VerifyEmail;