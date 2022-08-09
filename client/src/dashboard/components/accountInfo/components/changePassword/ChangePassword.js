import React, { useState, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { DescriptionText, FourthHeading, MainHeading } from '../../../../../components';
import { MdEdit, MdCancel } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useForm } from "react-hook-form";
import UserContext from '../../../../../contexts/user';
import api from '../../../../../api';


function ChangePassword(props) {

    const user = useContext(UserContext);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const [edit, setEdit] = useState(false);

    const [profileChange, setProfileChange] = useState(<div></div>);

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
        }
    }


    const onSubmit = async (data) => {

        const response = await fetch(`${api}/user/change-password`, {
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
            reset();
            setEdit(false);
            user.setUserState(content.user);
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
            setProfileChange(<div>
                <div className="margin-global-top-1" />
                <Row>
                    <DescriptionText
                        text="Invalid Password. Please try again."
                        classes="text-center margin-bottom-0"
                    />
                </Row>
            </div>)
        }
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
                            <Form onSubmit={handleSubmit(onSubmit)} className="form-style">
                                <input
                                    type="password"
                                    autoComplete="on"
                                    value=""
                                    style={{ display: 'none' }}
                                    readOnly={true}
                                />
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md={6} controlId="newPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                {...register("newPassword", {
                                                    required: true,
                                                    validate: (value) => {
                                                        const passwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/;
                                                        if (!value.match(passwReg)) {
                                                            return 'Password must contain atleast 1 lowercase alphabetical character, atleast 1 uppercase alphabetical character, atleast 1 numerical character, 1 special character and must be of atleast 8 characters';
                                                        }
                                                    },
                                                })}
                                                autoComplete="off"
                                                type={showNewPassword ? 'text' : 'password'}
                                            />
                                            <InputGroup.Text>
                                                {
                                                    showNewPassword ? (
                                                        <IoMdEye
                                                            onClick={() => { setShowNewPassword(false); }}
                                                            className="icon" />
                                                    ) : (
                                                        <IoMdEyeOff
                                                            onClick={() => { setShowNewPassword(true); }}
                                                            className="icon" />
                                                    )
                                                }
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{errors.newPassword && errors.newPassword.type === "required" && <span>New Password is required</span>}</div>
                                        <div className="error-text">{errors.newPassword && <p>{errors.newPassword.message}</p>}</div>
                                    </Form.Group>
                                    <Form.Group as={Col} md={6} controlId="confirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                {...register("confirmPassword", {
                                                    required: true,
                                                    validate: (value) => {
                                                        if (watch('newPassword') !== value) {
                                                            return "Your passwords do no match";
                                                        }
                                                    },
                                                })}
                                                autoComplete="off"
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
                                <Row className="justify-content-center">
                                    <Form.Group as={Col} md={6} controlId="oldPassword">
                                        <Form.Label>Old Password</Form.Label>
                                        <InputGroup size="lg">
                                            <Form.Control
                                                {...register("oldPassword", {
                                                    required: true,
                                                })}
                                                autoComplete="off"
                                                type={showOldPassword ? 'text' : 'password'}
                                            />
                                            <InputGroup.Text>
                                                {
                                                    showOldPassword ? (
                                                        <IoMdEye
                                                            onClick={() => { setShowOldPassword(false); }}
                                                            className="icon" />
                                                    ) : (
                                                        <IoMdEyeOff
                                                            onClick={() => { setShowOldPassword(true); }}
                                                            className="icon" />
                                                    )
                                                }
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <div className="error-text">{errors.oldPassword && errors.oldPassword.type === "required" && <span>Old Password is required</span>}</div>
                                        <div className="error-text">{errors.oldPassword && <p>{errors.oldPassword.message}</p>}</div>
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

export default ChangePassword;