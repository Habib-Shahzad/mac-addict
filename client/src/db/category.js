import { FormControl, Input, InputLabel, FormHelperText, Button, FormControlLabel, Checkbox, TextField } from '@mui/material';
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

        const response = await fetch(`${api}/category/set-active`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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


const categoryObj = {
    apiTable: `${api}/category/table-data`,
    deleteApi: `${api}/category/delete`,
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
                    {element.subCategories.map((firstChildValue, firstChildIndex) => {
                        return <TreeItem key={firstChildIndex} nodeId={`${firstChildValue._id}`} label={firstChildValue.name} >
                            {firstChildValue.furtherSubCategories.map((secondChildValue, secondChildIndex) => {
                                return <TreeItem key={secondChildIndex} nodeId={`${secondChildValue._id}`} label={secondChildValue.name} >
                                    {secondChildValue.products.map((thirdChildValue, thirdChildIndex) => {
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
    modelName: 'Category',
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


        const [categoriesArray, setCategoriesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);


        const { register, handleSubmit, formState: { errors }, control, reset } = useForm();


        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/category/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setCategoriesArray(content.data)
                    setLoading(false);
                })();
        }, [queryID]);


        const [defaultName, setDefaultName] = useState('');
        const [defaultKeywords, setDefaultKeywords] = useState('');
        const [defaultDescription, setDefaultDescription] = useState('');
        const [defaultActive, setDefaultActive] = useState(true);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultKeywords(editObj.keywords);
                setDefaultDescription(editObj.description);
                setDefaultActive(editObj.active);
            } else {
                setDefaultName('');
                setDefaultKeywords('');
                setDefaultDescription('');
                setDefaultActive(true);
            }
        }, [editObj]);


        const onSubmit = async data => {
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/category/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ name: data.name, keywords: data.keywords, description: data.description, active: data.active }),
                });
                const content = await response.json();
                setCategoriesArray([...categoriesArray, content.data]);
            } else {
                const response = await fetch(`${api}/category/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ _id: queryID, name: data.name, keywords: data.keywords, description: data.description, active: data.active }),
                });
                const content = await response.json();
                const objArray = [...categoriesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setCategoriesArray(objArray);
            }
            reset();
            if (pressedBtn === 1) {
                history.push('/admin/category');
            }
            else {
                setDefaultName('');
                setDefaultKeywords('');
                setDefaultDescription('');
                setDefaultActive(true);
                setLoading(false);
                queryID = '';
                history.push('/admin/category/add');
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
                                <FormHelperText id="name-helper">Enter name Ex.Makeup</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="keywords">
                        <FormControl className={classes.formControl}>
                            <InputLabel color="secondary">Keywords</InputLabel>
                            <Input
                                defaultValue={defaultKeywords}
                                color="secondary"
                                autoComplete="none"
                                {...register("keywords", {})}
                                type="text"
                                aria-describedby="keywords-helper"
                            />
                            <FormHelperText id="keywords-helper">Comma seperated SEO Keywords</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group controlId="description">
                        <FormControl className={classes.formControl}>
                            <TextField
                                defaultValue={defaultDescription}
                                {...register("description", {})}
                                color="secondary"
                                autoComplete="none"
                                label="Description"
                                multiline
                                rows={10}
                                aria-describedby="description-helper"
                            />
                            <FormHelperText id="description-helper">Type a description for SEO Ex. This category is...</FormHelperText>
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
        </Form >);
    },
}

export default categoryObj;