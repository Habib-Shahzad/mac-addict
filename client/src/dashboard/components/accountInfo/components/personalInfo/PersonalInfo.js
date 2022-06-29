import React, { useState, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FourthHeading, MainHeading, DescriptionText } from '../../../../../components';
import { MdEdit, MdCancel } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import './PersonalInfo.scss';
import { useForm } from "react-hook-form";
import api from '../../../../../api';
import UserContext from '../../../../../contexts/user';


function PersonalInfo(props) {

    const user = useContext(UserContext);

    const { register, handleSubmit, formState: { errors }, } = useForm(
        {
            defaultValues: {
                firstName: user.userState.firstName,
                lastName: user.userState.lastName,
                email: user.userState.email,
                contactNumber: user.userState.contactNumber,
            }
        }
    );


    const [showPassword, setShowPassword] = useState(false);

    const [edit, setEdit] = useState(false);
    const [profileChange, setProfileChange] = useState(<div></div>);


    const handleMouseDownPassword = event => {
        event.preventDefault();
    }

    const handleEditChange = _ => {
        setEdit(!edit);
        if (!edit) {
            setProfileChange(<div>
                <div className="margin-global-top-1" />
                <Row>
                    <DescriptionText
                        text="Please enter password to confirm changes"
                        classes="text-center margin-bottom-0"
                    />
                </Row>
            </div>)
        } else {
            setProfileChange(<div></div>);
        }
    }


    const onSubmit = async (data) => {
        const response = await fetch(`${api}/user/change-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                ...data
            })
        });
        const content = await response.json();

        if (content.success) {

            user.setUserState(content.user);
            setEdit(false);
            setProfileChange(<Row>
                <div className="margin-global-top-2"></div>
                <DescriptionText
                    text="Your changes have been confirmed."
                    classes="text-center"
                />
            </Row>)
            setTimeout(() => {
                setProfileChange(<div></div>)
            }, 2000)
        }
        else {
            setProfileChange(<Row>
                <div className="margin-global-top-2"></div>
                <DescriptionText
                    text="Invalid Password. Please try again."
                    classes="text-center"
                />
            </Row>)
        }
    }

    return (
        <div>
            <MainHeading
                text="Personal Information"
                classes="text-center"
            />
            <div className="margin-global-top-2" />
            <Container className="personal-info box-info">
                {
                    !edit ? (
                        <div>
                            <MdEdit onClick={handleEditChange} className="edit-icon" />
                            <Row>
                                <Col>
                                    <Row className="justify-content-start">
                                        <Col md={6}>
                                            <FourthHeading
                                                text="First Name:"
                                                notBold={user.userState.firstName}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Last Name:"
                                                notBold={user.userState.lastName}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                    </Row>
                                    <div className="margin-global-top-1" />
                                    <Row className="justify-content-start">
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Email:"
                                                notBold={user.userState.email}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Contact Number:"
                                                notBold={user.userState.contactNumber}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                {profileChange}
                            </Row>
                        </div>
                    ) : (
                        <div>
                            <MdCancel onClick={handleEditChange} className="edit-icon" />
                            <Form onSubmit={handleSubmit(onSubmit)} className="form-style">
                                <input
                                    type="password"
                                    autoComplete="on"
                                    value=""
                                    style={{ display: 'none' }}
                                    readOnly={true}
                                />
                                <Row className="justify-content-between">
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="firstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            {...register("firstName", {
                                                required: true,
                                            })}
                                            type="text" />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{errors.firstName && errors.firstName.type === "required" && <span>First Name required</span>}</div>
                                                <div className="error-text">{errors.firstName && <p>{errors.firstName.message}</p>}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="lastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            {...register("lastName", {
                                                required: true,
                                            })}
                                            type="text" />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{errors.lastName && errors.lastName.type === "required" && <span>Last Name is required</span>}</div>
                                                <div className="error-text">{errors.lastName && <p>{errors.lastName.message}</p>}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />
                                <Row className="justify-content-between">
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="contactNumber">
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
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{errors.contactNumber && errors.contactNumber.type === "required" && <span>Contact Number is required</span>}</div>
                                                <div className="error-text">{errors.contactNumber && <p>{errors.contactNumber.message}</p>}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="email">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register("email", {
                                                required: true,
                                                validate: (value) => {
                                                    var mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                                    if (!value.match(mailformat)) {
                                                        return "Please enter a valid email address";
                                                    }
                                                },
                                            })}
                                        />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{errors.email && errors.email.type === "required" && <span>Email is required</span>}</div>
                                                <div className="error-text">{errors.email && <p>{errors.email.message}</p>}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />
                                <Row className="justify-content-center">
                                    <Form.Group as={Col} md={6} controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                autoComplete="off"
                                                {...register("password", {
                                                    required: true,
                                                })}
                                                type={showPassword ? 'text' : 'password'}
                                            />
                                            <InputGroup.Text>
                                                {
                                                    showPassword ? (
                                                        <IoMdEye
                                                            onClick={() => { setShowPassword(false); }}
                                                            onMouseDown={handleMouseDownPassword}
                                                            className="icon" />
                                                    ) : (
                                                        <IoMdEyeOff
                                                            onClick={() => { setShowPassword(true); }}
                                                            onMouseDown={handleMouseDownPassword}
                                                            className="icon" />
                                                    )
                                                }
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{errors.password && errors.password.type === "required" && <span>Password is requried</span>}</div>
                                        <div className="error-text">{errors.password && <p>{errors.password.message}</p>}</div>
                                    </Form.Group>
                                </Row>
                                {profileChange}
                                <div className="margin-global-top-2"></div>
                                <Row className="justify-content-center">
                                    <Button type="submit" >Save</Button>
                                </Row>
                            </Form>
                        </div>
                    )
                }
            </Container>
        </div>
    );
}

export default PersonalInfo;