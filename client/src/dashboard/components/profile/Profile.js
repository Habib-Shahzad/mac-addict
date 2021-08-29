import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import api from '../../../api';
import { MainHeading, DescriptionText } from '../../../components';
import UserContext from '../../../contexts/user';
import './Profile.scss'

function Profile(props) {
    const user = useContext(UserContext);

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [lastName, setlastName] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [contactNumber, setContactNumber] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [password, setPassword] = useState({ value: '', errorText: '' });

    const [showEditButton, setShowEditButton] = useState(true);
    const [saveButton, setSaveButton] = useState({ show: false, disabled: false });
    const [showCancelEditButton, setShowCancelEditButton] = useState(false);

    const [profileChange, setProfileChange] = useState(<div></div>);

    const setEdit = e => {
        e.preventDefault();
        setFirstName(prevState => ({ ...prevState, readOnly: false }));
        setlastName(prevState => ({ ...prevState, readOnly: false }));
        setContactNumber(prevState => ({ ...prevState, readOnly: false }));
        setEmail(prevState => ({ ...prevState, readOnly: false }));
        setShowEditButton(false);
        setSaveButton({ show: true, disabled: false });
        setShowCancelEditButton(true);
        setProfileChange(<Row>
            <div className="margin-global-top-3"></div>
            <DescriptionText
                text="Please enter password to confirm changes"
                classes="text-center"
            />
        </Row>)
    }

    const cancelEdit = e => {
        e.preventDefault();
        setFirstName({ value: user.userState.firstName, errorText: '', error: false, readOnly: true });
        setlastName({ value: user.userState.lastName, errorText: '', error: false, readOnly: true });
        setContactNumber({ value: user.userState.contactNumber, errorText: '', error: false, readOnly: true });
        setEmail({ value: user.userState.email, errorText: '', error: false, readOnly: true });
        setPassword({ value: '', errorText: '' });
        setShowEditButton(true);
        setSaveButton({ show: false, disabled: false });
        setShowCancelEditButton(false);
        setProfileChange(<div></div>);
    }

    useEffect(() => {
        if (user.userState) {
            setFirstName(prevState => ({ ...prevState, value: user.userState.firstName }));
            setlastName(prevState => ({ ...prevState, value: user.userState.lastName }));
            setContactNumber(prevState => ({ ...prevState, value: user.userState.contactNumber }));
            setEmail(prevState => ({ ...prevState, value: user.userState.email }));
        } else {
            setFirstName(prevState => ({ ...prevState, value: '' }));
            setlastName(prevState => ({ ...prevState, value: '' }));
            setContactNumber(prevState => ({ ...prevState, value: '' }));
            setEmail(prevState => ({ ...prevState, value: '' }));
        }
    }, [user])

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
        setPassword({ value: event.target.value, errorText: '' });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/users/change-profile`, {
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
                }, 3000)
            } else {
                setProfileChange(<Row>
                    <div className="margin-global-top-2"></div>
                    <DescriptionText
                        text="Your changes have been confirmed."
                        classes="text-center"
                    />
                </Row>)
                setTimeout(() => {
                    setProfileChange(<div></div>)
                }, 3000)
            }
            setShowEditButton(true);
            setSaveButton({ show: false, disabled: false });
            setShowCancelEditButton(false);
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
            setShowEditButton(true);
            setSaveButton({ show: false, disabled: false });
            setShowCancelEditButton(false);
        }
    }

    return (
        <Container className="profile">
            <Form className="form-style">
                <div className="margin-global-top-5" />
                <MainHeading
                    text="Your Information"
                    classes="text-center"
                />
                <div className="margin-global-top-2"></div>
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={6} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control readOnly={firstName.readOnly} value={firstName.value} onChange={changeFirstName} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{firstName.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={6} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control readOnly={lastName.readOnly} value={lastName.value} onChange={changeLastName} type="text" />
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
                        <Form.Label>Contact Number:</Form.Label>
                        <Form.Control readOnly={contactNumber.readOnly} value={contactNumber.value} onChange={changeContactNumber} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{contactNumber.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={6} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control readOnly={email.readOnly} value={email.value} onChange={changeEmail} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{email.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <div className="margin-global-top-2" />
                {
                    saveButton.show ? (
                        <>
                            <Row className="justify-content-center">
                                <Form.Group className="input-form-group" as={Col} md={6} controlId="password">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control autoComplete="off" value={password.value} onChange={changePassword} type="password" />
                                    <div className="error-text">{password.errorText}</div>
                                </Form.Group>
                            </Row>
                        </>
                    ) : null
                }
                {profileChange}
                <div className="margin-global-top-3"></div>
                <Row className="justify-content-center">
                    {/* <div className="horizontal-center-margin profile-btns"> */}
                        {
                            showEditButton ? (
                                <Button type="text" onClick={setEdit}>Edit</Button>
                            ) : null
                        }
                        {
                            saveButton.show ? (
                                <Button disabled={saveButton.disabled} type="submit" onClick={handleSubmit}>Save</Button>
                            ) : null
                        }
                        {
                            showCancelEditButton ? (
                                <Button type="text" onClick={cancelEdit}>Cancel Edit</Button>
                            ) : null
                        }
                    {/* </div> */}
                </Row>
                <div className="margin-global-top-3"></div>
            </Form>
        </Container>
    );
}

export default Profile;