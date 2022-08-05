import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Container, Form, Col, Row, Button, Spinner } from 'react-bootstrap';
import { MainHeading } from '../../components';
import api from '../../api';




function ForgotPassword(props) {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = async (data) => {
        setDisable(true);
        setLoading(true);

        const response = await fetch(`${api}/user/reset-password-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: data.email, password: data.password })
        });

        const content = await response.json();

        if (!content.success) {
            setEmailError(true);
            setDisable(false);
            setLoading(false);
            setTimeout(() => {
                setEmailError(false);
            }, 3000);
        }

        else {
            setLoading(false);
            setEmailSent(true);
        }
    }

    return (
        <Container>
            <div className="margin-global-top-5" />
            <Row>
                <Col>
                    <MainHeading
                        text="Forgot Password?"
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
                            <div className="error-text">{emailError && <p>Email Not Found</p>}</div>
                            <div className="success-text">{emailSent && <p>Please check your email</p>}</div>

                        </Form.Group>
                    </Row>

                    <div className="margin-global-top-2" />


                    {
                        loading &&
                        <Row className="justify-content-center">
                            <Spinner style={{ color: '#cf993d' }} animation="border" />
                        </Row>
                    }

                    <div className="margin-global-top-2" />



                    <Row className="justify-content-center">
                        <Button disabled={disable} type="submit">
                            Submit
                        </Button>
                    </Row>

                    <div className="margin-global-top-2" />


                </Form>
            </Row>
        </Container>
    );
}

export default ForgotPassword;


