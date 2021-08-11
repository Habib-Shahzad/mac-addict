import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@material-ui/lab/TreeItem';

const createTableData = (data) => {
    const { _id, name, subCategory, active } = data;
    const subCategoryName = subCategory.name
    const categoryName = subCategory.category.name
    return { _id, name, subCategoryName, categoryName, active };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/further-Sub-category/set-active`, {
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

const furtherSubCategoryObj = {
    apiTable: `${api}/further-sub-category/table-data`,
    deleteApi: [`${api}/further-sub-category/get-by-ids`, `${api}/further-sub-category/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'subCategoryName', numeric: false, disablePadding: false, label: 'Sub category' },
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
                    {element.products.map((childValue, childIndex) => {
                        return <TreeItem key={childIndex} nodeId={`${childValue._id}`} label={childValue.name} />
                    })}
                </TreeItem>
            )
        }
        return html;
    },
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Further Sub Category',
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

        const [nameState, setNameState] = useState({ name: '', helperText: 'Enter name Ex. Foundation', error: false });
        const [subCategoryState, setSubCategoryState] = useState({ name: '', obj: undefined, helperText: 'Enter name Ex. Face', error: false });
        const [keywordsState, setKeywordsState] = useState({ name: '', helperText: 'Comma seperated SEO Keywords' });
        const [descriptionState, setDescriptionState] = useState({ name: '', helperText: 'Type a description for SEO Ex. This further sub category is...' });
        const [checkboxes, setCheckboxes] = useState({ active: true });

        const [furtherSubCategoriesArray, setFurtherSubCategoriesArray] = useState([]);
        const [subCategoriesArray, setSubCategoriesArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (subCategoryState.error === true) flag = true;
            else if (subCategoryState.name.length === 0) flag = true;
            else if (subCategoryState.obj === undefined) flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState, subCategoryState]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/further-sub-category/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setFurtherSubCategoriesArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/sub-category/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setSubCategoriesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            if (editObj) {
                setNameState(prevState => ({ ...prevState, name: editObj.name }));
                setSubCategoryState(prevState => ({ ...prevState, name: editObj.name, obj: editObj.subCategory }));
                setKeywordsState(prevState => ({ ...prevState, name: editObj.keywords }));
                setDescriptionState(prevState => ({ ...prevState, name: editObj.description }));
                setCheckboxes(prevState => ({ ...prevState, active: editObj.active }))
            } else {
                setNameState(prevState => ({ ...prevState, name: '' }));
                setSubCategoryState(prevState => ({ ...prevState, name: '', obj: undefined }));
                setKeywordsState(prevState => ({ ...prevState, name: '' }));
                setDescriptionState(prevState => ({ ...prevState, name: '' }));
                setCheckboxes(prevState => ({ ...prevState, active: true }))
            }
        }, [editObj]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            let obj = editObjCheck(furtherSubCategoriesArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Foundation', error: false }));
        };
        function changeSubCategoryState(event) {
            const { value } = event.target;
            const obj = subCategoriesArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            setSubCategoryState(prevState => ({ ...prevState, name: value, obj: obj }));
            if (value === '') setSubCategoryState(prevState => ({ ...prevState, helperText: 'Sub category is required!', error: true }));
            else setSubCategoryState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Face', error: false }));
        };
        function changeKeywordsState(event) {
            const { value } = event.target;
            setKeywordsState(prevState => ({ ...prevState, name: value }));
        };
        function changeDescriptionState(event) {
            const { value } = event.target;
            setDescriptionState(prevState => ({ ...prevState, name: value }));
        };
        function ChangeChexboxesState(event) {
            setCheckboxes(prevState => ({ ...prevState, active: !checkboxes.active }));
        }

        const onSubmit = async e => {
            e.preventDefault();
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/further-sub-category/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: nameState.name, subCategory: subCategoryState.obj, keywords: keywordsState.name, description: descriptionState.name, active: checkboxes.active }),
                });
                const content = await response.json();
                setFurtherSubCategoriesArray([...furtherSubCategoriesArray, content.data]);
            } else {
                const response = await fetch(`${api}/further-sub-category/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ _id: queryID, name: nameState.name, subCategory: subCategoryState.obj, keywords: keywordsState.name, description: descriptionState.name, active: checkboxes.active }),
                });
                const content = await response.json();
                const objArray = [...furtherSubCategoriesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setFurtherSubCategoriesArray(objArray);
            }
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/further-sub-category`,
                        state: { data: 'added', name: nameState.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/further-Sub-category`,
                        state: { data: 'edited', name: nameState.name }
                    });
                }
            }
            else {
                setNameState({ name: '', helperText: 'Enter name Ex. Foundation', error: false });
                setSubCategoryState({ name: '', obj: undefined, helperText: 'Enter name Ex. Face', error: false });
                setKeywordsState({ name: '', helperText: 'Comma seperated SEO Keywords' });
                setDescriptionState({ name: '', helperText: 'Type a description for SEO Ex. This sub category is...' })
                setCheckboxes({ active: true });
                setLoading(false);
                history.push('/admin/further-sub-category/add');
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
                    <Form.Group as={Col} md={6} controlId="subCategory">
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="combo-box-demo"
                                color="secondary"
                                options={subCategoriesArray}
                                getOptionLabel={(option) => option.name}
                                value={subCategoryState.obj ? subCategoryState.obj : null}
                                // style={{ width: 300 }}
                                renderInput={(params) => <TextField
                                    color="secondary"
                                    error={subCategoryState.error}
                                    onChange={changeSubCategoryState}
                                    onBlur={changeSubCategoryState}
                                    {...params} label="Sub Category"
                                />
                                }
                            />
                            <FormHelperText error={subCategoryState.error} id="subCategoryState-helper">{subCategoryState.helperText}</FormHelperText>
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

export default furtherSubCategoryObj;