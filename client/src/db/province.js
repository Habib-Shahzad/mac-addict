import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@material-ui/lab/TreeItem';

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

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

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

        const [nameState, setNameState] = useState({ name: '', helperText: 'Enter name Ex. Sindh', error: false });
        const [countryState, setCountryState] = useState({ name: '', obj: undefined, helperText: 'Enter name Ex. Pakistan', error: false });
        const [checkboxes, setCheckboxes] = useState({ active: true });

        const [provincesArray, setProvincesArray] = useState([]);
        const [countriesArray, setCountriesArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (countryState.error === true) flag = true;
            else if (countryState.name.length === 0) flag = true;
            else if (countryState.obj === undefined) flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState, countryState]);

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
                setNameState(prevState => ({ ...prevState, name: editObj.name }));
                setCountryState(prevState => ({ ...prevState, name: editObj.name, obj: editObj.country }));
                setCheckboxes(prevState => ({ ...prevState, active: editObj.active }));
            } else {
                setNameState(prevState => ({ ...prevState, name: '' }));
                setCountryState(prevState => ({ ...prevState, name: '', obj: undefined }));
                setCheckboxes(prevState => ({ ...prevState, active: true }));
            }
        }, [editObj]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            let obj = editObjCheck(provincesArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Sindh', error: false }));
        };
        function changeCountryState(event) {
            const { value } = event.target;
            const obj = countriesArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            setCountryState(prevState => ({ ...prevState, name: value, obj: obj }));
            if (value === '') setCountryState(prevState => ({ ...prevState, helperText: 'Country is required!', error: true }));
            else setCountryState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Pakistan', error: false }));
        };

        const handleActiveCheckbox = () => {
            setCheckboxes(prevState => ({ ...prevState, active: !checkboxes.active }));
        };

        const onSubmit = async e => {
            e.preventDefault();
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/province/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: nameState.name, country: countryState.obj, active: checkboxes.active }),
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
                    body: JSON.stringify({ _id: queryID, name: nameState.name, country: countryState.obj, active: checkboxes.active }),
                });
                const content = await response.json();
                const objArray = [...provincesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setProvincesArray(objArray);
            }
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/province`,
                        state: { data: 'added', name: nameState.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/province`,
                        state: { data: 'edited', name: nameState.name }
                    });
                }
            }
            else {
                setNameState({ name: '', helperText: 'Enter name Ex. Sindh', error: false });
                setCountryState({ name: '', obj: undefined, helperText: 'Enter name Ex. Pakistan', error: false });
                setCheckboxes({ active: true });
                setLoading(false);
                history.push('/admin/province/add');
            }
        };
        if (loading) return <div></div>

        return (<form onSubmit={onSubmit} autoComplete="off">
            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={nameState.error} color="secondary" htmlFor="name">Name</InputLabel>
                            <Input
                                color="secondary"
                                autoComplete="none"
                                value={nameState.name}
                                type="text"
                                error={nameState.error}
                                id="name"
                                name="name"
                                onChange={changeNameState}
                                onBlur={changeNameState}
                                aria-describedby="name-helper"
                            />
                            <FormHelperText error={nameState.error} id="name-helper">{nameState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="country">
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="combo-box-demo"
                                color="secondary"
                                options={countriesArray}
                                getOptionLabel={(option) => option.name}
                                value={countryState.obj ? countryState.obj : null}
                                // style={{ width: 300 }}
                                renderInput={(params) => <TextField
                                    color="secondary"
                                    error={countryState.error}
                                    onChange={changeCountryState}
                                    onBlur={changeCountryState}
                                    {...params} label="Country"
                                />
                                }
                            />
                            <FormHelperText error={countryState.error} id="countryState-helper">{countryState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="active">
                        <FormControlLabel
                            control={<Checkbox checked={checkboxes.active} onChange={handleActiveCheckbox} name="active" />}
                            label="Active"
                        />
                    </Form.Group>
                </Row>
            </fieldset>
            <Button className={classes.button} onClick={_ => setPressedBtn(1)} disabled={isDisabled} type="submit" variant="contained" color="primary">
                Save
            </Button>
            <Button onClick={_ => setPressedBtn(2)} disabled={isDisabled} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </form>);
    },
}

export default provinceObj;