import React, { useContext, useEffect } from 'react';
import { Container, Form, Col, Row, InputGroup, Button } from 'react-bootstrap';
import { IoMdEye } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { DescriptionText, MainHeading } from '../../components';
import UserContext from '../../contexts/user';
import './Signup.scss';

function Signup(props) {
    const history = useHistory();
    const user = useContext(UserContext);

    useEffect(() => {
        if (user.userState) {
            history.push('/');
        }
    }, [history, user.userState]);
    
    return (
        <Container>
            <div className="margin-global-top-5" />
            <Row>
                <Col>
                    <MainHeading
                        text="Ready to Shop?"
                        classes="text-center"
                    />
                </Col>
            </Row>
            <Row>
                <Form className="form-style margin-global-top-2">
                    <input
                        type="password"
                        autoComplete="on"
                        value=""
                        style={{ display: 'none' }}
                        readOnly={true}
                    />
                    <Row className="justify-content-between">
                        <Form.Group as={Col} md={6} controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-between">
                        <Form.Group as={Col} md={6} controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" />
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="contactNumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-between">
                        <Form.Group as={Col} md={6} controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    type="password"
                                />
                                <InputGroup.Text><IoMdEye className="icon" /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    type="password"
                                />
                                <InputGroup.Text><IoMdEye className="icon" /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-center">
                        <Button type="submit">
                            Signup
                        </Button>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row>
                        <Col>
                            <DescriptionText
                                text="Already have an Account? Sign In"
                                link="HERE"
                                to="/signin"
                                classes="text-center"
                            />
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
}

export default Signup;