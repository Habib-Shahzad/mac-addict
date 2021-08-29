import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { DescriptionText, FourthHeading, MainHeading } from '../../../../../components';
import { MdEdit, MdCancel } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import './PersonalInfo.scss';
import api from '../../../../../api';
import UserContext from '../../../../../contexts/user';

function PersonalInfo(props) {

    const user = useContext(UserContext);

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false });
    const [lastName, setlastName] = useState({ value: '', errorText: '', error: false });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false });
    const [contactNumber, setContactNumber] = useState({ value: '', errorText: '', error: false, showPassword: false });
    const [password, setPassword] = useState({ value: '', errorText: '' });

    const [edit, setEdit] = useState(false);

    const [profileChange, setProfileChange] = useState(<div></div>);
    const [saveButton, setSaveButton] = useState({ show: false, disabled: false });

    const revertFields = _ => {
        setFirstName(prevState => ({ ...prevState, value: props.dbUser.firstName }));
        setlastName(prevState => ({ ...prevState, value: props.dbUser.lastName }));
        setEmail(prevState => ({ ...prevState, value: props.dbUser.email }));
        setContactNumber(prevState => ({ ...prevState, value: props.dbUser.contactNumber }));
    }

    useEffect(() => {
        if (props.dbUser) {
            setFirstName(prevState => ({ ...prevState, value: props.dbUser.firstName }));
            setlastName(prevState => ({ ...prevState, value: props.dbUser.lastName }));
            setEmail(prevState => ({ ...prevState, value: props.dbUser.email }));
            setContactNumber(prevState => ({ ...prevState, value: props.dbUser.contactNumber }));
        }
    }, [props.dbUser]);

    const changeFirstName = event => {
        const { value } = event.target;
        setFirstName(prevState => ({ ...prevState, value: value }));
        if (value === '') setFirstName(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else setFirstName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName = event => {
        const { value } = event.target;
        setlastName(prevState => ({ ...prevState, value: value }));
        if (value === '') setlastName(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else setlastName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeContactNumber = event => {
        const phoneReg = /^\d{11}$/;
        setContactNumber(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setContactNumber(prevState => ({ ...prevState, errorText: 'Phone number is required!', error: true }));
        else if (!event.target.value.match(phoneReg)) setContactNumber(prevState => ({ ...prevState, errorText: 'Must contain 11 digits!', error: true }));
        else setContactNumber(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeEmail = event => {
        setEmail(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setEmail(prevState => ({ ...prevState, errorText: 'Email is required!', error: true }));
        else if (!event.target.value.includes('@')) setEmail(prevState => ({ ...prevState, errorText: 'Email must be valid!', error: true }));
        else setEmail(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changePassword = event => {
        setPassword(prevState => ({ ...prevState, value: event.target.value, errorText: '' }));
    }
    const handleClickShowPassword = _ => {
        setPassword(prevState => ({ ...prevState, showPassword: !password.showPassword }));
    }
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
            revertFields();
            setPassword({ value: '', errorText: '' });
        }
    }

    useEffect(() => {
        let flag = true;
        if (firstName.error === true) flag = true;
        else if (firstName.value.length === 0) flag = true;
        else if (lastName.error === true) flag = true;
        else if (lastName.value.length === 0) flag = true;
        else if (contactNumber.error === true) flag = true;
        else if (contactNumber.value.length === 0) flag = true;
        else if (email.error === true) flag = true;
        else if (email.value.length === 0) flag = true;
        else if (password.error === true) flag = true;
        else if (password.value.length === 0) flag = true;
        else flag = false;
        if (!flag) {
            setSaveButton(prevState => ({ ...prevState, disabled: false }));
        } else setSaveButton(prevState => ({ ...prevState, disabled: true }));
    }, [firstName, lastName, contactNumber, email, password]);

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/user/change-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                contactNumber: contactNumber.value.trim(),
                email: email.value.trim(),
                password: password.value
            })
        });
        const content = await response.json();
        handleEditChange();
        if (content.data === 'success') {
            user.setUserState(content.user);
            if (content.emailChange) {
                setProfileChange(<Row>
                    <div className="margin-global-top-2"></div>
                    <DescriptionText
                        text="Your changes have been confirmed. Please verify your email from the link that was emailed to you."
                        classes="text-center"
                    />
                </Row>)
                setTimeout(() => {
                    setProfileChange(<div></div>)
                }, 4000)
            } else {
        setProfileChange(
            <div>
                <div className="margin-global-top-2" />
                <Row>
                    <DescriptionText
                        text="Your changes have been confirmed"
                        classes="text-center margin-bottom-0 bold"
                    />
                </Row>
            </div>)
        setTimeout(() => {
            setProfileChange(<div></div>)
        }, 3000)
            }
            setSaveButton({ show: false, disabled: false });
        } else {
            setProfileChange(<Row>
                <div className="margin-global-top-2"></div>
                <DescriptionText
                    text="Invalid Password. Please try again."
                    classes="text-center"
                />
            </Row>)
            setTimeout(() => {
                setProfileChange(<div></div>)
            }, 3000)
            setSaveButton({ show: false, disabled: false });
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
                                                notBold={firstName.value}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Last Name:"
                                                notBold={lastName.value}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                    </Row>
                                    <div className="margin-global-top-1" />
                                    <Row className="justify-content-start">
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Email:"
                                                notBold={email.value}
                                                classes="margin-bottom-0"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Contact Number:"
                                                notBold={contactNumber.value}
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
                            <Form className="form-style">
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
                                        <Form.Control value={firstName.value} onChange={changeFirstName} type="text" />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{firstName.errorText}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="lastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control value={lastName.value} onChange={changeLastName} type="text" />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{lastName.errorText}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />
                                <Row className="justify-content-between">
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="contactNumber">
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control value={contactNumber.value} onChange={changeContactNumber} type="text" />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{contactNumber.errorText}</div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="input-form-group" as={Col} md={6} controlId="email">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control value={email.value} onChange={changeEmail} type="text" />
                                        <Row>
                                            <Col xs={8}>
                                                <div className="error-text">{email.errorText}</div>
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
                                                value={password.value}
                                                onChange={changePassword}
                                                type={password.showPassword ? 'text' : 'password'}
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
                                {profileChange}
                                <div className="margin-global-top-2"></div>
                                <Row className="justify-content-center">
                                    <Button disabled={saveButton.disabled} type="submit" onClick={handleSubmit}>Save</Button>
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