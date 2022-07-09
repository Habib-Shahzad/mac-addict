import { FormControl, Input, InputLabel, FormHelperText, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import { useForm } from "react-hook-form";


const createTableData = (data) => {
    const { _id, name } = data;
    return { _id, name };
}

// const editObjCheck = (data, value, editObj) => {
//     if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
//     else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
// }

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
}

const sizeObj = {
    apiTable: `${api}/size/table-data`,
    deleteApi: `${api}/size/delete`,
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
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
    modelName: 'Size',
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


        const [sizesArray, setSizesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        const [defaultName, setDefaultName] = useState('');

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/size/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setSizesArray(content.data)
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
            } else {

            }
        }, [editObj]);


        const { register, handleSubmit, formState: { errors }, reset } = useForm();


        const onSubmit = async (data) => {
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/size/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ name: data.name }),
                });
                const content = await response.json();
                setSizesArray([...sizesArray, content.data]);
            } else {
                const response = await fetch(`${api}/size/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ _id: queryID, name: data.name }),
                });
                const content = await response.json();
                const objArray = [...sizesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setSizesArray(objArray);
            }
            reset();
            if (pressedBtn === 1) {
                history.push('/admin/size');
            }
            else {
                setDefaultName('');
                setLoading(false);
                queryID = '';
                history.push('/admin/size/add');
            }
        };
        if (loading) return <div></div>;

        return (<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                                <FormHelperText id="name-helper">Enter name Ex. Small</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>
            </fieldset>
            <Button className={classes.button} onClick={_ => setPressedBtn(1)} type="submit" variant="contained" color="primary">
                Save
            </Button>
            <Button onClick={_ => setPressedBtn(2)} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </form>);
    },
}

export default sizeObj;