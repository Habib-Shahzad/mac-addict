import { FormControl, Input, InputLabel, FormHelperText, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import api from '../api';
import TreeItem from '@material-ui/lab/TreeItem';

const createTableData = (data) => {
    const { _id, name, hexCode } = data;
    return { _id, name, hexCode };
}

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
}

const colorObj = {
    apiTable: `${api}/color/table-data`,
    deleteApi: [`${api}/color/get-by-ids`, `${api}/color/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'hexCode', numeric: false, disablePadding: true, label: 'Color' },
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
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Color',
    ordering: 'name',
    searchField: 'name',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
    ],
    Form: function (id, classes) {
        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;
        const [editObj, setEditObj] = useState(null);

        const [nameState, setNameState] = useState({ name: '', helperText: 'Enter name Ex. Red', error: false });
        const [colorState, setColorState] = useState({ name: '', helperText: 'Please choose a color', error: false });

        const [colorsArray, setColorsArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (colorState.error === true) flag = true;
            else if (colorState.name.length === 0) flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState, colorState]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/color/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setColorsArray(content.data)
                    setLoading(false);
                })();
        }, [queryID, isDisabled]);

        useEffect(() => {
            if (editObj) {
                setNameState(prevState => ({ ...prevState, name: editObj.name, }));
                setColorState(prevState => ({ ...prevState, name: editObj.hexCode, }))
            } else {
                setNameState(prevState => ({ ...prevState, name: '' }));
            }
        }, [editObj]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            let obj = editObjCheck(colorsArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Red', error: false }));
        };
        function changeColorState(color) {
            setColorState(prevState => ({ ...prevState, name: color.hex }));
            if (color === '') setColorState(prevState => ({ ...prevState, helperText: 'Color is required!', error: true }));
            else setColorState(prevState => ({ ...prevState, helperText: 'Please choose a color', error: false }));
        };

        const onSubmit = async e => {
            e.preventDefault();
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/color/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: nameState.name, hexCode: colorState.name }),
                });
                const content = await response.json();
                setColorsArray([...colorsArray, content.data]);
            } else {
                const response = await fetch(`${api}/color/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ _id: queryID, name: nameState.name, hexCode: colorState.name }),
                });
                const content = await response.json();
                const objArray = [...colorsArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setColorsArray(objArray);
            }
            if (pressedBtn === 1) {
                history.push('/admin/color');
            }
            else {
                setNameState({ name: '', helperText: 'Enter name Ex. Red', error: false });
                setColorState({ name: '', helperText: 'Please choose a color', error: false });
                setLoading(false);
                queryID = '';
                history.push('/admin/color/add');
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
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl style={{marginLeft: '2rem'}} className={classes.formControl}>
                            <ChromePicker
                                color={colorState.name}
                                onChange={changeColorState}
                            />
                        </FormControl>
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

export default colorObj;