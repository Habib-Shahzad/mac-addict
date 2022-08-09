import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Container, Form, Col, Row, InputGroup, Button, Spinner } from 'react-bootstrap';
import { MainHeading, DescriptionText } from '../../components';
import { useForm } from "react-hook-form";
import api from '../../api';
import { useParams, } from "react-router-dom";


function ResetPassword(props) {
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [disable, setDisable] = useState(false);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changeError, setChangeError] = useState(false);

    const { passwordToken } = useParams();

    const onSubmit = async (data) => {
        setLoading(true);
        setDisable(true);

        const response = await fetch(`${api}/user/reset-change-password/${passwordToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                password: data.password
            })
        });

        const content = await response.json();

        if (!content.success) {
            setLoading(false);
            setDisable(false);
            setChangeError(true);
        }

        else {
            setLoading(false);
            setChangeSuccess(true);
        }


    }

    return (
        <Container>

            <div className="margin-global-top-5" />

            <Row>
                <Col>
                    <MainHeading
                        text="Reset Password"
                        classes="text-center"
                    />
                </Col>
            </Row>

            <Row>
                <Form onSubmit={handleSubmit(onSubmit)} className="form-style margin-global-top-2">
                    <input
                        id='hidden-pass'
                        type="password"
                        autoComplete="on"
                        value=""
                        style={{ display: 'none' }}
                        readOnly={true}
                    />

                    <Row className="justify-content-center">
                        <Form.Group as={Col} md={6} controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    disabled={disable}
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
                    </Row>

                    <Row className="justify-content-center">

                        <Form.Group as={Col} md={6} controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    disabled={disable}
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
                        </Row>
                    }

                    {
                        changeSuccess &&
                        <DescriptionText
                            text="Password Successfully Changed! Sign In"
                            link="HERE"
                            to="/signin"
                            classes="text-center"
                        />
                    }

                    {
                        changeError &&
                        <DescriptionText
                            text="Could not change Password! Please try again"
                            to={null}
                            classes="text-center"
                        />
                    }

                    <div className="margin-global-top-2" />

                    <Row className="justify-content-center">
                        <Button disabled={disable} type="submit">
                            Submit
                        </Button>
                    </Row>

                </Form>
            </Row>

        </Container>
    );
}

export default ResetPassword;





