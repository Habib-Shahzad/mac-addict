import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Card, IconButton, CardContent, Button, CardMedia, InputAdornment, InputLabel, Input, FormControl, Typography } from '@mui/material';
import { Email, Visibility, VisibilityOff, Lock } from '@mui/icons-material';
// import loginUser from '../../loginUser';
import './Login.scss';
import api from '../../api';


import { useForm } from "react-hook-form";

function Login(props) {
    document.title = props.title

    const [showPassword, setShowPassword] = useState(false);


    const [loginMessage, setLoginMessage] = useState("");

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const handleClickShowPassword = _ => {
        setShowPassword(!showPassword);
    }


    const onSubmit = async (data) => {

        const response = await fetch(`${api}/user/admin-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: data.email, password: data.password })
        });
        const content = await response.json();
        if (content.success) {
            props.user.setAdminUserState(content.data);
        }
        else {
            setLoginMessage(content.message);
        }
    }

    return (
        <Container fluid className="admin-login-container">
            <Row>
                <Col className="admin-login-card">
                    <Card className="admin-login-base">
                        <CardMedia
                            className="login-logo"
                            component="img"
                            image={`logo.png`}
                            title="MAC Addict"
                        />
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" >
                                <FormControl className="admin-card-formcontrol">
                                    <InputLabel htmlFor="email-admin">Email</InputLabel>
                                    <Input
                                        autoComplete="off"
                                        autoFocus
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
                                        id="email-admin"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <div className="error-text">{errors.email && errors.email.type === "required" && <span>Email is required</span>}</div>
                                <div className="error-text">{errors.email && <p>{errors.email.message}</p>}</div>

                                <FormControl className="admin-card-formcontrol">
                                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                    <Input
                                        autoComplete="off"
                                        id="standard-adornment-password"
                                        {...register("password", {
                                            required: true
                                        })}
                                        type={showPassword ? 'text' : 'password'}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <div className="error-text">{errors.password && errors.password.type === "required" && <span>Password is required</span>}</div>
                                <div className="error-text">{errors.password && <p>{errors.password.message}</p>}</div>

                                <input
                                    type="text"
                                    autoComplete="on"
                                    value=""
                                    style={{ display: 'none' }}
                                    readOnly={true}
                                />
                                <Button type="submit" variant="contained" color="primary" className="admin-login-button">
                                    Login
                                </Button>


                            </form>
                        </CardContent>

                        <Typography style={{ textAlign: 'center', marginTop: '1rem' }} variant="subtitle1" display="block" gutterBottom>
                            {loginMessage}
                        </Typography>


                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;