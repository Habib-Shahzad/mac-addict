import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@material-ui/lab/TreeItem';

const createTableData = (data) => {
    const { _id, name, city, active } = data;
    const cityName = city.name
    const provinceName = city.province.name
    const countryName = city.province.country.name
    return { _id, name, cityName, provinceName, countryName, active };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/area/set-active`, {
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

const areaObj = {
    apiTable: `${api}/area/table-data`,
    deleteApi: [`${api}/area/get-by-ids`, `${api}/area/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'cityName', numeric: false, disablePadding: false, label: 'City' },
        { id: 'provinceName', numeric: false, disablePadding: false, label: 'Province' },
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
                    {element.addresses.map((firstChildValue, firstChildIndex) => {
                        return <TreeItem key={firstChildIndex} nodeId={`${firstChildValue._id}`} label={firstChildValue.name} />
                    })}
                </TreeItem>
            )
        }
        return html;
    },
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Area',
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

        const [nameState, setNameState] = useState({ name: '', helperText: 'Enter name Ex. DHA Phase 1', error: false });
        const [cityState, setCityState] = useState({ name: '', obj: undefined, helperText: 'Enter name Ex. Karachi', error: false });
        const [checkboxes, setCheckboxes] = useState({ active: false });

        const [areasArray, setAreasArray] = useState([]);
        const [citiesArray, setCitiesArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (cityState.error === true) flag = true;
            else if (cityState.name.length === 0) flag = true;
            else if (cityState.obj === undefined) flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState, cityState]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/area/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setAreasArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/city/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setCitiesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            if (editObj) {
                setNameState(prevState => ({ ...prevState, name: editObj.name }));
                setCityState(prevState => ({ ...prevState, name: editObj.name, obj: editObj.province }));
                setCheckboxes(prevState => ({ ...prevState, active: editObj.active }));
            } else {
                setNameState(prevState => ({ ...prevState, name: '' }));
                setCityState(prevState => ({ ...prevState, name: '', obj: undefined }));
                setCheckboxes(prevState => ({ ...prevState, active: true }));
            }
        }, [editObj]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            let obj = editObjCheck(areasArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. DHA Phase 1', error: false }));
        };
        function changeCityState(event) {
            const { value } = event.target;
            const obj = citiesArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            setCityState(prevState => ({ ...prevState, name: value, obj: obj }));
            if (value === '') setCityState(prevState => ({ ...prevState, helperText: 'City is required!', error: true }));
            else setCityState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Karachi', error: false }));
        };
        function ChangeChexboxesState(event) {
            setCheckboxes(prevState => ({ ...prevState, active: !checkboxes.active }));
        }

        const onSubmit = async e => {
            e.preventDefault();
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/area/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: nameState.name, city: cityState.obj, active: checkboxes.active }),
                });
                const content = await response.json();
                setAreasArray([...areasArray, content.data]);
            } else {
                const response = await fetch(`${api}/area/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ _id: queryID, name: nameState.name, city: cityState.obj, active: checkboxes.active }),
                });
                const content = await response.json();
                const objArray = [...areasArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setAreasArray(objArray);
            }
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/area`,
                        state: { data: 'added', name: nameState.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/area`,
                        state: { data: 'edited', name: nameState.name }
                    });
                }
            }
            else {
                setNameState({ name: '', helperText: 'Enter name Ex. DHA Phase 1', error: false });
                setCityState({ name: '', obj: undefined, helperText: 'Enter name Ex. Karachi', error: false });
                setCheckboxes({ active: true });
                setLoading(false);
                history.push('/admin/area/add');
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
                    <Form.Group as={Col} md={6} controlId="province">
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="combo-box-demo"
                                color="secondary"
                                options={citiesArray}
                                getOptionLabel={(option) => option.name}
                                value={cityState.obj ? cityState.obj : null}
                                // style={{ width: 300 }}
                                renderInput={(params) => <TextField
                                    color="secondary"
                                    error={cityState.error}
                                    onChange={changeCityState}
                                    onBlur={changeCityState}
                                    {...params} label="City"
                                />
                                }
                            />
                            <FormHelperText error={cityState.error} id="cityState-helper">{cityState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControlLabel
                            control={<Checkbox checked={checkboxes.active} onChange={ChangeChexboxesState} name="active" />}
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

export default areaObj;