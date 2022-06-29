import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Col, Row, InputGroup, Button } from 'react-bootstrap';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import { DescriptionText, MainHeading } from '../../components';
import { useForm } from "react-hook-form";
import UserContext from '../../contexts/user';

function Signin(props) {

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const history = useHistory();

    const user = useContext(UserContext);

    const onSubmit = async (data) => {
        const response = await fetch(`${api}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: data.email, password: data.password })
        });


        const content = await response.json();

        const userLoggedin = content.data;
        user.setUserState(userLoggedin);

        if (!userLoggedin) {
            setLoginError(true);
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
                <Form onSubmit={handleSubmit(onSubmit)} className="form-style margin-global-top-2">
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
                                {...register("email", {
                                    required: true,
                                    validate: (value) => {
                                        var mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                        if (!value.match(mailformat)) {
                                            return "Please enter a valid email address";
                                        }
                                    },
                                })}
                                type="text" />
                            <div className="error-text">{errors.email && errors.email.type === "required" && <span>Email is required</span>}</div>
                            <div className="error-text">{errors.email && <p>{errors.email.message}</p>}</div>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-center">
                        <Form.Group as={Col} md={6} controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    {...register("password", {
                                        required: true
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                />
                                <InputGroup.Text>
                                    {
                                        showPassword ? (
                                            <IoMdEye
                                                onClick={() => { setShowPassword(false); }}
                                                className="icon" />
                                        ) : (
                                            <IoMdEyeOff
                                                onClick={() => { setShowPassword(true); }}
                                                className="icon" />
                                        )
                                    }
                                </InputGroup.Text>
                            </InputGroup>
                            <div className="error-text">{errors.password && errors.password.type === "required" && <span>Password is required</span>}</div>
                            <div className="error-text">{errors.password && <p>{errors.password.message}</p>}</div>


                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />


                    {
                        loginError && (
                            <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '-2rem' }} className="error-text">{"Email and password do not match!"}</div>
                        )
                    }


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