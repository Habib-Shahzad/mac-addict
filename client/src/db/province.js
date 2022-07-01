import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import { useForm, Controller } from "react-hook-form";


const createTableData = (data) => {
    const { _id, name, country, active } = data;
    const countryName = country.name
    return { _id, name, countryName, active };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/province/set-active`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// const editObjCheck = (data, value, editObj) => {
//     if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
//     else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
// }

const provinceObj = {
    apiTable: `${api}/province/table-data`,
    deleteApi: [`${api}/province/get-by-ids`, `${api}/province/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'countryName', numeric: false, disablePadding: false, label: 'Country' },
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
                    {element.cities.map((firstChildValue, firstChildIndex) => {
                        return <TreeItem key={firstChildIndex} nodeId={`${firstChildValue._id}`} label={firstChildValue.name} >
                            {firstChildValue.areas.map((secondChildValue, secondChildIndex) => {
                                return <TreeItem key={secondChildIndex} nodeId={`${secondChildValue._id}`} label={secondChildValue.name} >
                                    {secondChildValue.addresses.map((thirdChildValue, thirdChildIndex) => {
                                        return <TreeItem key={thirdChildIndex} nodeId={`${thirdChildValue._id}`} label={thirdChildValue.name} />
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
    modelName: 'Province',
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

        const [provincesArray, setProvincesArray] = useState([]);
        const [countriesArray, setCountriesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);


        const [defaultName, setDefaultName] = useState('');
        const [defaultCountry, setDefaultCountry] = useState('');
        const [defaultActive, setDefaultActive] = useState(true);


        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/province/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setProvincesArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/country/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setCountriesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultCountry(editObj.country);
                setDefaultActive(editObj.active);
            } else {

            }
        }, [editObj]);

        const { register, handleSubmit, formState: { errors }, control, reset } = useForm();


        const onSubmit = async (data) => {
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/province/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: data.name, country: data.country, active: data.active }),
                });
                const content = await response.json();
                setProvincesArray([...provincesArray, content.data]);
            } else {
                const response = await fetch(`${api}/province/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ _id: queryID, name: data.name, country: data.country, active: data.active }),
                });
                const content = await response.json();
                const objArray = [...provincesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setProvincesArray(objArray);
            }

            reset();
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/province`,
                        state: { data: 'added', name: data.name }
                    });
                } else {

                    history.push({
                        pathname: `/admin/province`,
                        state: { data: 'edited', name: data.name }
                    });
                }
            }
            else {
                setDefaultName('');
                setDefaultCountry('');
                setDefaultActive(true);
                setLoading(false);
                history.push('/admin/province/add');
            }
        };
        if (loading) return <div></div>

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
                                <FormHelperText id="name-helper">Enter name Ex. Punjab</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="country">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultCountry : undefined}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={countriesArray}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => props.field.onChange(data)}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors.country ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Country"
                                            />
                                        }
                                    />
                                )}
                                rules={{ required: "Country is required!" }}
                                onChange={([, data]) => data}
                                defaultValue={defaultCountry}
                                name={"country"}
                                control={control}
                            />
                            {!errors.country &&
                                <FormHelperText id="name-helper">Select country Ex. Pakistan</FormHelperText>
                            }
                            <FormHelperText error={errors.country ? true : false} id="name-helper">{errors.country && <>{errors.country.message}</>}</FormHelperText>

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

export default provinceObj;