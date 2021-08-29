import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { DescriptionText, FourthHeading, MainHeading } from '../../../../../components';
import { MdEdit, MdCancel } from "react-icons/md";
import { IoMdEye } from 'react-icons/io';

function ChangePassword(props) {
    const [oldPassword, setOldPassword] = useState({ value: '', errorText: '', showPassword: false });
    const [password, setPassword] = useState({ value: '', errorText: '', showPassword: false, error: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', errorText: '', showPassword: false, error: false });

    const [edit, setEdit] = useState(false);

    const [profileChange, setProfileChange] = useState(<div></div>);
    const [saveButton, setSaveButton] = useState({ show: false, disabled: false });

    const changeOldPassword = event => {
        setOldPassword(prevState => ({ ...prevState, value: event.target.value }));
    }

    const changePassword = event => {
        const { value } = event.target;
        const passwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/;
        setPassword(prevState => ({ ...prevState, value: value }));
        if (!value.match(passwReg)) setPassword(prevState => ({ ...prevState, errorText: 'Password must contain atleast 1 lowercase alhpabetical character, atleast 1 uppercase alhpabetical character, atleast 1 numerical character, 1 special character and must be of atleast 8 characters', error: true }));
        else setPassword(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    // const handleClickShowPassword = _ => {
    //     setPassword(prevState => ({ ...prevState, showPassword: !password.showPassword }));
    // }
    // const handleMouseDownPassword = event => {
    //     event.preventDefault();
    // }

    const changeConfirmPassword = event => {
        setConfirmPassword(prevState => ({ ...prevState, value: event.target.value }));
    }

    const handleEditChange = _ => {
        setEdit(!edit);
        if (!edit) {
            setProfileChange(
                <div>
                    <div className="margin-global-top-2" />
                    <Row>
                        <DescriptionText
                            text="Please enter password to confirm changes"
                            classes="text-center margin-bottom-0"
                        />
                    </Row>
                </div>
            )
        } else {
            setProfileChange(<div></div>);
            setPassword({ value: '', errorText: '' });
        }
    }

    useEffect(() => {
        let flag = true;
        if (oldPassword.error === true) flag = true;
        else if (oldPassword.value.length === 0) flag = true;
        else if (password.error === true) flag = true;
        else if (password.value.length === 0) flag = true;
        else if (confirmPassword.error === true) flag = true;
        else flag = false;
        if (!flag) {
            setSaveButton(prevState => ({ ...prevState, disabled: false }));
        } else setSaveButton(prevState => ({ ...prevState, disabled: true }));
    }, [oldPassword, password, confirmPassword]);

    const handleSubmit = async e => {
        e.preventDefault();
        // const response = await fetch(`${api}/users/change-password`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     credentials: 'include',
        //     withCredentials: true,
        //     body: JSON.stringify({ oldPassword: oldPassword.value, password: password.value, confirmPassword: confirmPassword.value })
        // });
        // const content = await response.json();
        setPassword(prevState => ({ ...prevState, value: '', errorText: '', error: false, readOnly: true, showText: 'Show Password' }));
        setConfirmPassword(prevState => ({ ...prevState, value: '', errorText: '', error: false, readOnly: true, showText: 'Show Password' }));
        setOldPassword(prevState => ({ ...prevState, value: '', errorText: '' }));
        // if (content.data === true) {
        setProfileChange(
            <div>
                <div className="margin-global-top-3" />
                <Row>
                    <DescriptionText
                        text="Your changes have been confirmed"
                        classes="text-center margin-bottom-0 bold"
                    />
                </Row>
            </div>)
        setTimeout(() => {
            setProfileChange(<div></div>)
        }, 1500)
        // setShowEditButton(true);
        setSaveButton({ show: false, disabled: false });
        // setShowCancelEditButton(false);
        // } else {
        //     setProfileChange(<Row>
        //         <div className="global-mt-2"></div>
        //         <ParaText
        //             text="Invalid Password. Please try again."
        //             textAlign="center"
        //         />
        //     </Row>)
        //     setTimeout(() => {
        //         setProfileChange(<div></div>)
        //     }, 3000)
        //     setShowEditButton(true);
        //     setSaveButton({ show: false, disabled: false });
        //     setShowCancelEditButton(false);
        // }
    }

    return (
        <div>
            <MainHeading
                text="Password"
                classes="text-center"
            />
            <div className="margin-global-top-2" />
            <Container className="change-password box-info">
                {
                    !edit ? (
                        <div>
                            <MdEdit onClick={handleEditChange} className="edit-icon" />
                            <Row>
                                <Col>
                                    <Row className="justify-content-start">
                                        <Col md={6}>
                                            <FourthHeading
                                                text="Password:"
                                                notBold="•••••••"
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
                                    <Form.Group as={Col} md={6} controlId="password">
                                        <Form.Label>New Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control autoComplete="off" value={password.value} onChange={changePassword} type="password" />
                                            <InputGroup.Text><IoMdEye className="icon" /></InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{password.errorText}</div>
                                    </Form.Group>
                                    <Form.Group as={Col} md={6} controlId="confirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control autoComplete="off" value={confirmPassword.value} onChange={changeConfirmPassword} type="password" />
                                            <InputGroup.Text><IoMdEye className="icon" /></InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{confirmPassword.errorText}</div>
                                    </Form.Group>
                                </Row>
                                <div className="margin-global-top-2" />
                                <Row className="justify-content-center">
                                    <Form.Group as={Col} md={6} controlId="oldPassword">
                                        <Form.Label>Old Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control autoComplete="off" value={oldPassword.value} onChange={changeOldPassword} type="password" />
                                            <InputGroup.Text><IoMdEye className="icon" /></InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{oldPassword.errorText}</div>
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

export default ChangePassword;