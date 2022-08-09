import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Col, Row, InputGroup, Button, Spinner } from 'react-bootstrap';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { DescriptionText, MainHeading, VerifyEmail } from '../../components';
import UserContext from '../../contexts/user';
import { useForm } from "react-hook-form";
import api from '../../api';
import './Signup.scss';

function Signup(props) {
    const { register, handleSubmit, watch, formState: { errors }, } = useForm();

    const history = useHistory();
    const user = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showVerifyComponent, setShowVerifyComponent] = useState(false);

    const [loading, setLoading] = useState(false);

    const [emailTaken, setEmailTaken] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const response = await fetch(`${api}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactNumber: data.contactNumber,
                password: data.password
            })
        });

        const content = await response.json();
        if (content.success) {
            setShowVerifyComponent(true);
        }
        else {
            setLoading(false);
            setEmailTaken(true);
            console.log(content?.error);
            setTimeout(() => {
                setEmailTaken(false);
            }, 5000);
        }
    };

    useEffect(() => {
        if (user.userState) {
            history.push('/');
        }
    }, [history, user.userState]);

    return (
        <Container>

            {
                showVerifyComponent ?
                    <VerifyEmail />
                    :
                    <>
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
                            <Form onSubmit={handleSubmit(onSubmit)} className="form-style margin-global-top-2">
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
                                        <Form.Control
                                            {...register("firstName", {
                                                required: true,
                                            })}
                                            type="text" />
                                        <div className="error-text">{errors.firstName && errors.firstName.type === "required" && <span>First Name required</span>}</div>
                                        <div className="error-text">{errors.firstName && <p>{errors.firstName.message}</p>}</div>
                                    </Form.Group>
                                    <Form.Group as={Col} md={6} controlId="lastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            {...register("lastName", {
                                                required: true,
                                            })}
                                            type="text" />
                                        <div className="error-text">{errors.lastName && errors.lastName.type === "required" && <span>Last Name is required</span>}</div>
                                        <div className="error-text">{errors.lastName && <p>{errors.lastName.message}</p>}</div>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />
                                <Row className="justify-content-between">
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
                                    <Form.Group as={Col} md={6} controlId="contactNumber">
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control
                                            {...register("contactNumber", {
                                                required: true,
                                                validate: (value) => {
                                                    var format = /^\d{11}$/
                                                    if (!value.match(format)) {
                                                        return "Contact number must be 11 digits";
                                                    }
                                                },

                                            })}
                                            type="text" />
                                        <div className="error-text">{errors.contactNumber && errors.contactNumber.type === "required" && <span>Contact Number is required</span>}</div>
                                        <div className="error-text">{errors.contactNumber && <p>{errors.contactNumber.message}</p>}</div>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md={6} controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                {...register("password", {
                                                    required: true,
                                                    validate: (value) => {
                                                        const passwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/;
                                                        if (!value.match(passwReg)) {
                                                            return 'Password must contain atleast 1 lowercase alphabetical character, atleast 1 uppercase alphabetical character, atleast 1 numerical character, 1 special character and must be of atleast 8 characters';
                                                        }
                                                    },
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
                                    <Form.Group as={Col} md={6} controlId="confirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                {...register("confirmPassword", {
                                                    required: true,
                                                    validate: (value) => {
                                                        if (watch('password') !== value) {
                                                            return "Your passwords do no match";
                                                        }
                                                    },
                                                })}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                            />
                                            <InputGroup.Text>
                                                {
                                                    showConfirmPassword ? (
                                                        <IoMdEye
                                                            onClick={() => { setShowConfirmPassword(false); }}
                                                            className="icon" />
                                                    ) : (
                                                        <IoMdEyeOff
                                                            onClick={() => { setShowConfirmPassword(true); }}
                                                            className="icon" />
                                                    )
                                                }
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{errors.confirmPassword && errors.confirmPassword.type === "required" && <span>Confirm Password is required</span>}</div>
                                        <div className="error-text">{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}</div>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />


                                {
                                    loading &&
                                    <Row className="justify-content-center">
                                        <Spinner style={{ color: '#cf993d' }} animation="border" />
                                        <div className="margin-global-top-2" />
                                    </Row>
                                }

                                <Row className="justify-content-center">
                                    <Button disabled={loading} type="submit">
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

                                        {
                                            emailTaken && (
                                                <DescriptionText
                                                    text="Email taken by another user"
                                                    to={null}
                                                    classes="text-center"
                                                />
                                            )
                                        }
                                    </Col>
                                </Row>
                            </Form>
                        </Row>
                    </>
            }
        </Container>
    );
}

export default Signup;