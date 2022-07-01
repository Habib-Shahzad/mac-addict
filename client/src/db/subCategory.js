import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';

import { useForm, Controller } from "react-hook-form";


const createTableData = (data) => {
    const { _id, name, slug, category, active } = data;
    const categoryName = category.name
    return { _id, name, slug, categoryName, active };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/sub-category/set-active`, {
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



const subCategoryObj = {
    apiTable: `${api}/sub-category/table-data`,
    deleteApi: [`${api}/sub-category/get-by-ids`, `${api}/sub-category/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'slug', numeric: false, disablePadding: true, label: 'Slug' },
        { id: 'categoryName', numeric: false, disablePadding: false, label: 'Category' },
        { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    Delete: function (items) {
        let html = [];
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            console.log(element);
            html.push(
                <TreeItem key={i} nodeId={`${element._id}`} label={element.name}>
                    {element.furtherSubCategories.map((childValue, childIndex) => {
                        return <TreeItem key={childIndex} nodeId={`${childValue._id}`} label={childValue.name} >
                            {childValue.products.map((subChildValue, subChildIndex) => {
                                return <TreeItem key={subChildIndex} nodeId={`${subChildValue._id}`} label={subChildValue.name} />
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
    modelName: 'Sub Category',
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



        const [subCategoriesArray, setSubCategoriesArray] = useState([]);
        const [categoriesArray, setCategoriesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        const [defaultName, setDefaultName] = useState('');
        const [defaultCategory, setDefaultCategory] = useState('');
        const [defaultKeywords, setDefaultKeywords] = useState('');
        const [defaultDescription, setDefaultDescription] = useState('');
        const [defaultActive, setDefaultActive] = useState(true);


        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/sub-category/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setSubCategoriesArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/category/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setCategoriesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultCategory(editObj.category);
                setDefaultKeywords(editObj.keywords);
                setDefaultDescription(editObj.description);
                setDefaultActive(editObj.active);
            } else {

            }
        }, [editObj]);


        const { register, handleSubmit, formState: { errors }, control, reset } = useForm();


        const onSubmit = async (data) => {
            setLoading(true);

            if (queryID === '') {
                const response = await fetch(`${api}/sub-category/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: data.name, category: data.category, keywords: data.keywords, description: data.description, active: data.active }),
                });
                const content = await response.json();
                setSubCategoriesArray([...subCategoriesArray, content.data]);
            } else {
                const response = await fetch(`${api}/sub-category/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ _id: queryID, name: data.name, category: data.category, keywords: data.keywords, description: data.description, active: data.active }),
                });
                const content = await response.json();
                const objArray = [...subCategoriesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setSubCategoriesArray(objArray);
            }
            reset();
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/sub-category`,
                        state: { data: 'added', name: data.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/sub-category`,
                        state: { data: 'edited', name: data.name }
                    });
                }
            }
            else {
                setDefaultName('');
                setDefaultCategory('');
                setDefaultKeywords('');
                setDefaultDescription('');

                setLoading(false);
                history.push('/admin/sub-category/add');
            }
        };


        if (loading) return <div></div>

        return (<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.name ? true : false} color="secondary">Name</InputLabel>
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
                                <FormHelperText id="name-helper">Enter name Ex. Face</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="category">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultCategory : undefined}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={categoriesArray}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => props.field.onChange(data)}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors.category ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Category"
                                            />
                                        }
                                    />
                                )}
                                rules={{ required: "Category is required!" }}
                                onChange={([, data]) => data}
                                defaultValue={defaultCategory}
                                name={"category"}
                                control={control}
                            />
                            {!errors.category &&
                                <FormHelperText id="name-helper">Enter name Ex. makeup</FormHelperText>
                            }
                            <FormHelperText error={errors.category ? true : false} id="name-helper">{errors.category && <>{errors.category.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
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
        </Form>);
    },
}

export default subCategoryObj;