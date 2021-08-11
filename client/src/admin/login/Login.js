import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Card, IconButton, CardContent, Button, CardMedia, InputAdornment, InputLabel, Input, FormControl } from '@material-ui/core';
import { Email, Visibility, VisibilityOff, Lock } from '@material-ui/icons';
// import loginUser from '../../loginUser';
import './Login.scss';
import api from '../../api';
import url from '../../url';

function Login(props) {
    document.title = props.title

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = _ => {
        setShowPassword(!showPassword);
    }
    const handleMouseDownPassword = event => {
        event.preventDefault();
    }
    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: email, password: password })
        });
        const content = await response.json();
        try {
            const user = content.data;
            props.user.setUserState(user);
        } catch (error) {
            props.user.setUserState(null);
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
                            image={`${url}logo.png`}
                            title="Mzushi"
                        />
                        <CardContent>
                            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <FormControl className="admin-card-formcontrol">
                                    <InputLabel htmlFor="email-admin">Email</InputLabel>
                                    <Input
                                        autoComplete="off"
                                        autoFocus
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        id="email-admin"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <FormControl className="admin-card-formcontrol">
                                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                    <Input
                                        autoComplete="off"
                                        id="standard-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
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
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;