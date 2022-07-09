import { FormControl, Input, InputLabel, FormHelperText, Button, FormControlLabel, Checkbox } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import { useForm, Controller } from "react-hook-form";


const createTableData = (data) => {
    const { _id, name, active } = data;
    return { _id, name, active };
}

// const editObjCheck = (data, value, editObj) => {
//     if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
//     else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
// }

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/country/set-active`, {
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
}

const countryObj = {
    apiTable: `${api}/country/table-data`,
    deleteApi: `${api}/country/delete`,
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    Delete: function (items) {
        let html = [];
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            html.push(
                <TreeItem key={i} nodeId={`${element._id}`} label={element.name}>
                    {element.provinces.map((firstChildValue, firstChildIndex) => {
                        return <TreeItem key={firstChildIndex} nodeId={`${firstChildValue._id}`} label={firstChildValue.name} >
                            {firstChildValue.cities.map((secondChildValue, secondChildIndex) => {
                                return <TreeItem key={secondChildIndex} nodeId={`${secondChildValue._id}`} label={secondChildValue.name} >
                                    {secondChildValue.areas.map((thirdChildValue, thirdChildIndex) => {
                                        return <TreeItem key={thirdChildIndex} nodeId={`${thirdChildValue._id}`} label={thirdChildValue.name} >
                                            {thirdChildValue.addresses.map((fourthChildValue, fourthChildIndex) => {
                                                return <TreeItem key={fourthChildIndex} nodeId={`${fourthChildValue._id}`} label={fourthChildValue.name} />
                                            })}
                                        </TreeItem>
                                    })}
                                </TreeItem>
                            })}
                        </TreeItem>
                    })}
                </TreeItem>
            )
        }
        return html;
    },
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Country',
    ordering: 'name',
    searchField: 'name',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
        { label: 'Set active', value: 'active', type: 'active' },
        { label: 'Set in-active', value: 'in-active', type: 'active' }
    ],
    Form: function (id, classes) {
        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;
        const [editObj, setEditObj] = useState(null);


        const [countriesArray, setCountriesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        const [defaultName, setDefaultName] = useState('');
        const [defaultActive, setDefaultActive] = useState(true);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/country/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setCountriesArray(content.data)
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultActive(editObj.active);
            } else {

            }
        }, [editObj]);


        const { register, handleSubmit, formState: { errors }, control, reset } = useForm();


        const onSubmit = async (data) => {
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/country/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ name: data.name, active: data.active }),
                });
                const content = await response.json();
                setCountriesArray([...countriesArray, content.data]);
            } else {
                const response = await fetch(`${api}/country/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ _id: queryID, name: data.name, active: data.active }),
                });
                const content = await response.json();
                const objArray = [...countriesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setCountriesArray(objArray);
            }

            reset();
            if (pressedBtn === 1) {
                history.push('/admin/country');
            }
            else {
                setDefaultName('');
                setDefaultActive(true);
                setLoading(false);
                queryID = '';
                history.push('/admin/country/add');
            }
        };
        if (loading) return <div></div>;

        return (<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.name ? true : false} color="secondary" htmlFor="name">Name</InputLabel>
                            <Input
                                {...register("name", {
                                    required: "Name is required!",
                                })}
                                defaultValue={defaultName}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                                error={errors.name ? true : false}
                                aria-describedby="name-helper"
                            />
                            {!errors.name &&
                                <FormHelperText id="name-helper">Enter name Ex. Pakistan</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="active">

                        <FormControlLabel
                            control={
                                <Controller
                                    name={"active"}
                                    control={control}
                                    defaultValue={defaultActive}
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

export default countryObj;