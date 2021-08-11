import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@material-ui/lab/TreeItem';

const createTableData = (data) => {
    const { _id, name, category, active } = data;
    const categoryName = category.name
    return { _id, name, categoryName, active };
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

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const subCategoryObj = {
    apiTable: `${api}/sub-category/table-data`,
    deleteApi: [`${api}/sub-category/get-by-ids`, `${api}/sub-category/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
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

        const [subCategory, setSubCategory] = useState({ name: '', helperText: 'Enter name Ex. Face', error: false });
        const [categoryState, setCategoryState] = useState({ name: '', obj: undefined, helperText: 'Enter name Ex. Makeup', error: false });
        const [keywordsState, setKeywordsState] = useState({ name: '', helperText: 'Comma seperated SEO Keywords' });
        const [descriptionState, setDescriptionState] = useState({ name: '', helperText: 'Type a description for SEO Ex. This sub category is...' });
        const [checkboxes, setCheckboxes] = useState({ active: true });

        const [subCategoriesArray, setSubCategoriesArray] = useState([]);
        const [categoriesArray, setCategoriesArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let flag = true;
            if (subCategory.error === true) flag = true;
            else if (subCategory.name.length === 0) flag = true;
            else if (categoryState.error === true) flag = true;
            else if (categoryState.name.length === 0) flag = true;
            else if (categoryState.obj === undefined) flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [subCategory, categoryState]);

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
                setSubCategory(prevState => ({ ...prevState, name: editObj.name }));
                setCategoryState(prevState => ({ ...prevState, name: editObj.name, obj: editObj.category }));
                setKeywordsState(prevState => ({ ...prevState, name: editObj.keywords }));
                setDescriptionState(prevState => ({ ...prevState, name: editObj.description }));
                setCheckboxes(prevState => ({ ...prevState, active: editObj.active }))
            } else {
                setSubCategory(prevState => ({ ...prevState, name: '' }));
                setCategoryState(prevState => ({ ...prevState, name: '', obj: undefined }));
                setKeywordsState(prevState => ({ ...prevState, name: '' }));
                setDescriptionState(prevState => ({ ...prevState, name: '' }));
                setCheckboxes(prevState => ({ ...prevState, active: true }))
            }
        }, [editObj]);

        function changeSubCategory(event) {
            const { value } = event.target;
            setSubCategory(prevState => ({ ...prevState, name: value }));
            let obj = editObjCheck(subCategoriesArray, value, editObj);
            if (obj) setSubCategory(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setSubCategory(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setSubCategory(prevState => ({ ...prevState, helperText: 'Enter name Ex. Face', error: false }));
        };
        function changeCategoryState(event) {
            const { value } = event.target;
            const obj = categoriesArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            setCategoryState(prevState => ({ ...prevState, name: value, obj: obj }));
            if (value === '') setCategoryState(prevState => ({ ...prevState, helperText: 'Category is required!', error: true }));
            else setCategoryState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Makeup', error: false }));
        };
        function changeKeywordsState(event) {
            const { value } = event.target;
            setKeywordsState(prevState => ({ ...prevState, name: value }));
        };
        function changeDescriptionState(event) {
            const { value } = event.target;
            setDescriptionState(prevState => ({ ...prevState, name: value }));
        };

        const handleActiveCheckbox = () => {
            setCheckboxes(prevState => ({ ...prevState, active: !checkboxes.active }));
        };

        const onSubmit = async e => {
            e.preventDefault();
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/sub-category/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: subCategory.name, category: categoryState.obj, keywords: keywordsState.name, description: descriptionState.name, active: checkboxes.active }),
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
                    body: JSON.stringify({ _id: queryID, name: subCategory.name, category: categoryState.obj, keywords: keywordsState.name, description: descriptionState.name, active: checkboxes.active }),
                });
                const content = await response.json();
                const objArray = [...subCategoriesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setSubCategoriesArray(objArray);
            }
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/sub-category`,
                        state: { data: 'added', name: subCategory.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/sub-category`,
                        state: { data: 'edited', name: subCategory.name }
                    });
                }
            }
            else {
                setSubCategory({ name: '', helperText: 'Enter name Ex. Face', error: false });
                setCategoryState({ name: '', obj: undefined, helperText: 'Enter name Ex. Makeup', error: false });
                setKeywordsState({ name: '', helperText: 'Comma seperated SEO Keywords' });
                setDescriptionState({ name: '', helperText: 'Type a description for SEO Ex. This sub category is...' })
                setCheckboxes({ active: true });
                setLoading(false);
                history.push('/admin/sub-category/add');
            }
        };
        if (loading) return <div></div>

        return (<form onSubmit={onSubmit} autoComplete="off">
            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={subCategory.error} color="secondary" htmlFor="name">Name</InputLabel>
                            <Input
                                color="secondary"
                                autoComplete="none"
                                value={subCategory.name}
                                type="text"
                                error={subCategory.error}
                                id="name"
                                name="name"
                                onChange={changeSubCategory}
                                onBlur={changeSubCategory}
                                aria-describedby="name-helper"
                            />
                            <FormHelperText error={subCategory.error} id="name-helper">{subCategory.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="category">
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="combo-box-demo"
                                color="secondary"
                                options={categoriesArray}
                                getOptionLabel={(option) => option.name}
                                value={categoryState.obj ? categoryState.obj : null}
                                // style={{ width: 300 }}
                                renderInput={(params) => <TextField
                                    color="secondary"
                                    error={categoryState.error}
                                    onChange={changeCategoryState}
                                    onBlur={changeCategoryState}
                                    {...params} label="Category"
                                />
                                }
                            />
                            <FormHelperText error={categoryState.error} id="categoryState-helper">{categoryState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="keywords">
                        <FormControl className={classes.formControl}>
                            <InputLabel color="secondary" htmlFor="keywords">Keywords</InputLabel>
                            <Input
                                color="secondary"
                                autoComplete="none"
                                value={keywordsState.name}
                                type="text"
                                id="keywords"
                                name="keywords"
                                onChange={changeKeywordsState}
                                onBlur={changeKeywordsState}
                                aria-describedby="keywords-helper"
                            />
                            <FormHelperText id="keywords-helper">{keywordsState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group controlId="description">
                        <FormControl className={classes.formControl}>
                            <TextField
                                id="description"
                                color="secondary"
                                autoComplete="none"
                                label="Description"
                                onChange={changeDescriptionState}
                                onBlur={changeDescriptionState}
                                multiline
                                rows={10}
                                value={descriptionState.name}
                                aria-describedby="description-helper"
                            />
                            <FormHelperText id="description-helper">{descriptionState.helperText}</FormHelperText>
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

export default subCategoryObj;