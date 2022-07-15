import React, { useState, useEffect } from 'react';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import { useForm, Controller } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { FormControl, Input, FormControlLabel, Checkbox, InputLabel, FormHelperText, Button, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const createTableData = (data) => {
    const { _id, firstName, lastName, email, contactNumber, active, admin } = data;
    return { _id, firstName, lastName, email, contactNumber, active, admin };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/user/set-active`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ active: active, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
            rows.push(createTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }

    if (obj.type === 'admin') {
        const rows = [];
        let admin = true;
        if (obj.value === 'non-admin') admin = false;
        const response = await fetch(`${api}/user/set-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ admin: admin, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
            rows.push(createTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }
}

const userObj = {
    apiTable: `${api}/user/table-data`,
    deleteApi: `${api}/user/delete`,
    createTableData: createTableData,
    headCells: [
        { id: 'firstName', numeric: false, disablePadding: true, label: 'First Name' },
        { id: 'lastName', numeric: false, disablePadding: true, label: 'Last Name' },
        { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
        { id: 'contactNumber', numeric: false, disablePadding: false, label: 'Contact' },
        { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
        { id: 'admin', numeric: false, disablePadding: false, label: 'Admin' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    Delete: function (items) {
        let html = [];
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            html.push(
                <TreeItem key={i} nodeId={`${element._id}`} label={element.name} />
            )
        }
        return html;
    },
    editAllowed: false,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'User',
    ordering: 'firstName',
    searchField: 'firstName',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
        { label: 'Set active', value: 'active', type: 'active' },
        { label: 'Set in-active', value: 'in-active', type: 'active' },
        { label: 'Set admin', value: 'admin', type: 'admin' },
        { label: 'Set non-admin', value: 'non-admin', type: 'admin' },
    ],



    Form: function (id, classes) {

        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;

        const [usersArray, setUsersArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        const [errorMessage, setErrorMessage] = useState("");

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/user/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                        credentials: 'include',
                        withCredentials: true,
                    });
                    const content = await response.json();
                    setUsersArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);

        const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm();

        const onSubmit = async (data) => {
            setLoading(true);

            let success = false;

            if (queryID === '') {
                const response = await fetch(`${api}/user/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        contactNumber: data.contactNumber,
                        password: data.password,
                        active: data.active,
                        admin: data.admin,
                    }),
                });
                const content = await response.json();

                if (content.success) {
                    setUsersArray([...usersArray, content.data]);
                    success = true;
                }

                else {
                    setErrorMessage(content.error);
                    setLoading(false);
                }

            }

            if (success) {

                reset();
                if (pressedBtn === 1) {
                    if (queryID === '') {
                        history.push({
                            pathname: `/admin/user`,
                            state: { data: 'added', name: data.firstName }
                        });
                    }
                }
                else {
                    setLoading(false);
                    history.push('/admin/user/add');
                }
            }
        };



        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);


        const handleClickShowPassword = () => {
            setShowPassword(!showPassword);
        };

        const handleClickShowConfirmPassword = () => {
            setShowConfirmPassword(!showConfirmPassword);
        }

        const handleMouseDownPassword = (event) => {
            event.preventDefault();
        };


        if (loading) return <div></div>


        return (
            <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <fieldset>
                    <legend>Details</legend>
                    <Row className={classes.rowGap}>
                        <Form.Group as={Col} md={6} controlId="firstName">
                            <FormControl className={classes.formControl}>
                                <InputLabel error={errors.firstName ? true : false} color="secondary" htmlFor="name">First Name</InputLabel>
                                <Input
                                    {...register("firstName", {
                                        required: "First Name is required!",
                                    })}
                                    color="secondary"
                                    autoComplete="none"
                                    type="text"
                                    error={errors.firstName ? true : false}
                                    aria-describedby="name-helper"
                                />
                                {!errors.firstName &&
                                    <FormHelperText id="name-helper">Enter First Name Ex. John</FormHelperText>
                                }
                                <FormHelperText error={errors.firstName ? true : false} id="name-helper">{errors.firstName && <>{errors.firstName.message}</>}</FormHelperText>

                            </FormControl>
                        </Form.Group>


                        <Form.Group as={Col} md={6} controlId="lastName">
                            <FormControl className={classes.formControl}>
                                <InputLabel error={errors.lastName ? true : false} color="secondary" htmlFor="name">Last Name</InputLabel>
                                <Input
                                    {...register("lastName", {
                                        required: "Last Name is required!",
                                    })}
                                    color="secondary"
                                    autoComplete="none"
                                    type="text"
                                    error={errors.lastName ? true : false}
                                    aria-describedby="name-helper"
                                />
                                {!errors.lastName &&
                                    <FormHelperText id="name-helper">Enter First Name Ex. Smith</FormHelperText>
                                }
                                <FormHelperText error={errors.lastName ? true : false} id="name-helper">{errors.lastName && <>{errors.lastName.message}</>}</FormHelperText>

                            </FormControl>
                        </Form.Group>

                    </Row>

                    <Row className={classes.rowGap}>

                        <Form.Group as={Col} md={6} controlId="email">
                            <FormControl className={classes.formControl}>
                                <InputLabel error={errors.email ? true : false} color="secondary" htmlFor="name">Email</InputLabel>
                                <Input
                                    {...register("email", {
                                        required: "Email is required!",
                                    })}
                                    color="secondary"
                                    autoComplete="none"
                                    type="text"
                                    error={errors.email ? true : false}
                                    aria-describedby="name-helper"
                                />
                                {!errors.email &&
                                    <FormHelperText id="name-helper">Enter Email Ex. john@example.com</FormHelperText>
                                }
                                <FormHelperText error={errors.email ? true : false} id="name-helper">{errors.email && <>{errors.email.message}</>}</FormHelperText>

                            </FormControl>
                        </Form.Group>

                        <Form.Group as={Col} md={6} controlId="contactNumber">
                            <FormControl className={classes.formControl}>
                                <InputLabel error={errors.contactNumber ? true : false} color="secondary" htmlFor="name">Contact Number</InputLabel>
                                <Input
                                    {...register("contactNumber", {
                                        required: "Contact is required!",
                                    })}
                                    color="secondary"
                                    autoComplete="none"
                                    type="text"
                                    error={errors.contactNumber ? true : false}
                                    aria-describedby="name-helper"
                                />
                                {!errors.contactNumber &&
                                    <FormHelperText id="name-helper">Enter Contact Number</FormHelperText>
                                }
                                <FormHelperText error={errors.contactNumber ? true : false} id="name-helper">{errors.contactNumber && <>{errors.contactNumber.message}</>}</FormHelperText>

                            </FormControl>
                        </Form.Group>


                    </Row>

                    <Row className={classes.rowGap}>

                        <Form.Group as={Col} md={6} controlId="password">
                            <FormControl className={classes.formControl}>
                                <InputLabel error={errors.password ? true : false} color="secondary" htmlFor="name">Password</InputLabel>
                                <Input
                                    {...register("password", {
                                        required: "Password is required!",
                                    })}
                                    color="secondary"
                                    autoComplete="none"
                                    type={showPassword ? 'text' : 'password'}
                                    error={errors.password ? true : false}
                                    aria-describedby="name-helper"

                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {!errors.password &&
                                    <FormHelperText id="name-helper">Enter Password</FormHelperText>
                                }
                                <FormHelperText error={errors.password ? true : false} id="name-helper">{errors.password && <>{errors.password.message}</>}</FormHelperText>

                            </FormControl>
                        </Form.Group>


                        <Form.Group as={Col} md={6} controlId="confirmPassword">
                            <FormControl className={classes.formControl}>
                                <InputLabel error={errors.confirmPassword ? true : false} color="secondary" htmlFor="name">Confirm Password</InputLabel>
                                <Input
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required!",
                                        validate: (value) => value === watch("password") || "Passwords do not match"
                                    })}
                                    color="secondary"
                                    autoComplete="none"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    error={errors.confirmPassword ? true : false}
                                    aria-describedby="name-helper"

                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }

                                />
                                {!errors.confirmPassword &&
                                    <FormHelperText id="name-helper">Confirm the password</FormHelperText>
                                }
                                <FormHelperText error={errors.confirmPassword ? true : false} id="name-helper">{errors.confirmPassword && <>{errors.confirmPassword.message}</>}</FormHelperText>

                            </FormControl>
                        </Form.Group>

                    </Row>


                    <Row className={classes.rowGap}>
                        <Form.Group as={Col} md={6} controlId="active">

                            <FormControlLabel
                                control={
                                    <Controller
                                        name={"active"}
                                        defaultValue={true}
                                        control={control}
                                        render={(props) => (
                                            <Checkbox
                                                checked={props.field.value}
                                                onChange={(e) => props.field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                }
                                label={"Active"}
                            />
                        </Form.Group>
                    </Row>


                    <Row className={classes.rowGap}>
                        <Form.Group as={Col} md={6} controlId="admin">

                            <FormControlLabel
                                control={
                                    <Controller
                                        name={"admin"}
                                        defaultValue={false}
                                        control={control}
                                        render={(props) => (
                                            <Checkbox
                                                checked={props.field.value}
                                                onChange={(e) => props.field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                }
                                label={"Admin"}
                            />
                        </Form.Group>
                    </Row>

                    {
                        errorMessage.length > 0 && (
                            <>
                                <FormHelperText style={{ margin: '1rem' }} error={errorMessage.length > 0 ? true : false} >{errorMessage.length > 0 && <>{errorMessage}</>}</FormHelperText>
                            </>
                        )
                    }

                </fieldset>
                <Button className={classes.button} onClick={_ => setPressedBtn(1)} type="submit" variant="contained" color="primary">
                    Save
                </Button>
                <Button onClick={_ => setPressedBtn(2)} type="submit" variant="contained" color="primary">
                    Save and add another
                </Button>
            </Form>);
    },
}

export default userObj;