import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Col, Row, InputGroup, Button } from 'react-bootstrap';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import { DescriptionText, MainHeading } from '../../components';
import UserContext from '../../contexts/user';

function Signin(props) {
    const [email, setEmail] = useState({ name: '', errorText: '', error: false });
    const [password, setPassword] = useState({ name: '', errorText: '', error: false, showPassword: false });
    const history = useHistory();

    const user = useContext(UserContext);

    const handleClickShowPassword = _ => {
        setPassword(prevState => ({ ...prevState, showPassword: !password.showPassword }));
    }
    const handleMouseDownPassword = event => {
        event.preventDefault();
    }
    const changePassword = event => {
        setPassword(prevState => ({ ...prevState, name: event.target.value }));
    }

    const changeEmail = event => {
        setEmail(prevState => ({ ...prevState, name: event.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: email.name, password: password.name })
        });
        const content = await response.json();
        try {
            const userLoggedin = content.data;
            if (userLoggedin === null) {
                setEmail(prevState => ({ ...prevState, name: '', errorText: 'Invalid Credentials!', error: true }));
                setPassword(prevState => ({ ...prevState, name: '', errorText: 'Invalid Credentials!', error: true, showPassword: false }));
            } else {
                user.setUserState(userLoggedin);
            }
        } catch (error) {
        }
    }

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
                        text="Welcome Back"
                        classes="text-center"
                    />
                </Col>
            </Row>
            <Row>
                <Form onSubmit={handleSubmit} className="form-style margin-global-top-2">
                    <input
                        type="password"
                        autoComplete="on"
                        value=""
                        style={{ display: 'none' }}
                        readOnly={true}
                    />
                    <Row className="justify-content-center">
                        <Form.Group as={Col} md={6} controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                onChange={changeEmail}
                                value={email.name}
                            />
                            <div className="error-text">{email.errorText}</div>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-center">
                        <Form.Group as={Col} md={6} controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    type={password.showPassword ? 'text' : 'password'}
                                    onChange={changePassword}
                                    value={password.name}
                                />
                                <InputGroup.Text>
                                    {
                                        password.showPassword ? (
                                            <IoMdEye
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                className="icon" />
                                        ) : (
                                            <IoMdEyeOff
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                className="icon" />
                                        )
                                    }
                                </InputGroup.Text>
                            </InputGroup>
                            <div className="error-text">{password.errorText}</div>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-center">
                        <Button type="submit">
                            Signin
                        </Button>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row>
                        <Col>
                            <DescriptionText
                                text="Not a Registered Customer? Sign Up"
                                link="HERE"
                                to="/signup"
                                classes="text-center"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DescriptionText
                                text="Forgot Password? Click"
                                link="HERE"
                                to="/forgot-password"
                                classes="text-center"
                            />
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
}

export default Signin;