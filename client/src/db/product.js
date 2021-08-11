import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField, Divider, IconButton } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import api from '../api';
import TreeItem from '@material-ui/lab/TreeItem';

const createTableData = (data) => {
    const { _id, imagePath, name, points, furtherSubCategory, brand, active } = data;
    const furtherSubCategoryName = furtherSubCategory.name;
    const brandName = brand.name;
    return { _id, imagePath, name, points, furtherSubCategoryName, brandName, active };
}

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/product/set-active`, {
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

const productObj = {
    apiTable: `${api}/product/table-data`,
    deleteApi: [`${api}/product/get-by-ids`, `${api}/product/delete`],
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'imagePath', numeric: false, disablePadding: true, label: 'Image' },
        { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'points', numeric: false, disablePadding: false, label: 'Points to avail' },
        { id: 'furtherSubCategoryName', numeric: false, disablePadding: false, label: 'Further Sub Category' },
        { id: 'brandName', numeric: false, disablePadding: false, label: 'Brand' },
        { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
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
    modelName: 'Product',
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

        const [nameState, setNameState] = useState({ name: '', helperText: 'Enter name Ex. BACKSTAGE Face & Body Foundation', error: false });
        const [furtherSubCategoryState, setFurtherSubCategoryState] = useState({ name: '', obj: undefined, helperText: 'Enter name Ex. Face', error: false });
        const [brandState, setBrandState] = useState({ name: '', obj: undefined, helperText: 'Enter name Ex. Dior', error: false });
        const [pointsState, setPointsState] = useState({ name: '', helperText: 'Enter points Ex. 25', error: false });
        const [keywordsState, setKeywordsState] = useState({ name: '', helperText: 'Comma seperated SEO Keywords' });
        const [descriptionState, setDescriptionState] = useState({ name: '', helperText: 'Type a description Ex. This product is...', error: false });
        const [imagePathState, setImagePathState] = useState({ name: '', helperText: 'Please insert an image url Ex. https://www.sephora.com/productimages/sku/s2070571-main-zoom.jpg', error: false });
        const [checkboxes, setCheckboxes] = useState({ active: true, hasColor: true });
        const [productDetails, setProductDetails] = useState([{ imagePath: '', imageError: false, imageHelper: 'Please insert an image url', color: undefined, colorError: false, colorHelper: 'Please select a color', size: undefined, sizeError: false, sizeHelper: 'Please sleect a size', price: 0, qty: 0, preOrder: false }]);
        const [productsArray, setProductsArray] = useState([]);
        const [furtherSubCategoriesArray, setFurtherSubCategoriesArray] = useState([]);
        const [brandsArray, setBrandsArray] = useState([]);
        const [colorsArray, setColorsArray] = useState([]);
        const [sizesArray, setSizesArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (furtherSubCategoryState.error === true) flag = true;
            else if (furtherSubCategoryState.name.length === 0) flag = true;
            else if (furtherSubCategoryState.obj === undefined) flag = true;
            else if (brandState.error === true) flag = true;
            else if (brandState.name.length === 0) flag = true;
            else if (brandState.obj === undefined) flag = true;
            else if (pointsState.error === true) flag = true;
            else if (pointsState.name.length === 0) flag = true;
            else if (imagePathState.error === true) flag = true;
            else if (imagePathState.name.length === 0) flag = true;
            else if (descriptionState.error === true) flag = true;
            else if (descriptionState.name.length === 0) flag = true;
            else flag = false;
            for (let index = 0; index < productDetails.length; index++) {
                const element = productDetails[index];
                if (element.imagePath === '') {
                    flag = true;
                    break;
                } else if (element.imageError === true) {
                    flag = true;
                    break;
                } else if (checkboxes.hasColor === true && element.color === undefined) {
                    flag = true;
                    break;
                } else if (checkboxes.hasColor === true && element.colorError === true) {
                    flag = true;
                    break;
                } else if (checkboxes.hasColor === true && element.color.length === 0) {
                    flag = true;
                    break;
                } else if (element.size === undefined) {
                    flag = true;
                    break;
                } else if (element.sizeError === true) {
                    flag = true;
                    break;
                } else if (element.size.length === 0) {
                    flag = true;
                    break;
                }
            }
            setCanSubmit(flag);
        }, [nameState, furtherSubCategoryState, descriptionState, brandState, imagePathState, pointsState, productDetails, checkboxes.hasColor]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/product/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setProductsArray(content.data)
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/further-sub-category/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setFurtherSubCategoriesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/brand/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setBrandsArray(content.data)
                })();
        }, []);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/color/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setColorsArray(content.data)
                })();
        }, []);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/size/table-data-auto`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    setSizesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            if (editObj) {
                setNameState(prevState => ({ ...prevState, name: editObj.name }));
                setFurtherSubCategoryState(prevState => ({ ...prevState, name: editObj.name, obj: editObj.furtherSubCategory }));
                setBrandState(prevState => ({ ...prevState, name: editObj.name, obj: editObj.brand }));
                setPointsState(prevState => ({ ...prevState, name: editObj.points }));
                setKeywordsState(prevState => ({ ...prevState, name: editObj.keywords }));
                setImagePathState(prevState => ({ ...prevState, name: editObj.imagePath }));
                setDescriptionState(prevState => ({ ...prevState, name: editObj.description }));
                setCheckboxes(prevState => ({ ...prevState, active: editObj.active, hasColor: editObj.hasColor }))
                const list = [];
                editObj.productDetails.forEach(element => {
                    list.push({ imagePath: element.imagePath, color: element.color, size: element.size, price: element.price, qty: element.quantity, preOrder: element.preOrder })
                });
                setProductDetails(list);
            } else {
                setNameState(prevState => ({ ...prevState, name: '' }));
                setFurtherSubCategoryState(prevState => ({ ...prevState, name: '', obj: undefined }));
                setBrandState(prevState => ({ ...prevState, name: '', obj: undefined }))
                setPointsState(prevState => ({ ...prevState, name: '' }));;
                setKeywordsState(prevState => ({ ...prevState, name: '' }));
                setImagePathState(prevState => ({ ...prevState, name: '' }));
                setDescriptionState(prevState => ({ ...prevState, name: '' }));
                setCheckboxes(prevState => ({ ...prevState, active: true, hasColor: true }));
                setProductDetails([{ imagePath: '', imageError: false, imageHelper: 'Please insert an image url', color: undefined, colorError: false, colorHelper: 'Please select a color', size: undefined, sizeError: false, sizeHelper: 'Please sleect a size', price: 0, qty: 0, preOrder: false }]);
            }
        }, [editObj]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            let obj = editObjCheck(productsArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. BACKSTAGE Face & Body Foundation', error: false }));
        };
        function changeFurtherSubCategoryState(event) {
            const { value } = event.target;
            const obj = furtherSubCategoriesArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            setFurtherSubCategoryState(prevState => ({ ...prevState, name: value, obj: obj }));
            if (value === '') setFurtherSubCategoryState(prevState => ({ ...prevState, helperText: 'Further sub category is required!', error: true }));
            else setFurtherSubCategoryState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Face', error: false }));
        };
        function changeBrandState(event) {
            const { value } = event.target;
            const obj = brandsArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            setBrandState(prevState => ({ ...prevState, name: value, obj: obj }));
            if (value === '') setBrandState(prevState => ({ ...prevState, helperText: 'Brand is required!', error: true }));
            else setBrandState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Dior', error: false }));
        };
        function changePointsState(event) {
            const { value } = event.target;
            const reg = /^\d+$/;
            setPointsState(prevState => ({ ...prevState, name: value }));
            if (value === '') setPointsState(prevState => ({ ...prevState, helperText: 'Points are required!', error: true }));
            else if (!value.match(reg)) setPointsState(prevState => ({ ...prevState, helperText: 'Must contain digits only!', error: true }));
            else setPointsState(prevState => ({ ...prevState, helperText: 'Enter points Ex. 25', error: false }));
        };
        function changeKeywordsState(event) {
            const { value } = event.target;
            setKeywordsState(prevState => ({ ...prevState, name: value }));
        };
        function changeImagePathState(event) {
            const { value } = event.target;
            setImagePathState(prevState => ({ ...prevState, name: value }));
            if (value === '') setImagePathState(prevState => ({ ...prevState, helperText: 'Image URL is required!', error: true }));
            else setImagePathState(prevState => ({ ...prevState, helperText: 'Please insert an image url Ex. https://www.sephora.com/productimages/sku/s2070571-main-zoom.jpg', error: false }));
        };
        function changeDescriptionState(event) {
            const { value } = event.target;
            setDescriptionState(prevState => ({ ...prevState, name: value }));
            if (value === '') setDescriptionState(prevState => ({ ...prevState, helperText: 'Description is required!', error: true }));
            else setDescriptionState(prevState => ({ ...prevState, helperText: 'Type a description Ex. This product is...', error: false }));
        };
        const handleActiveCheckbox = () => {
            setCheckboxes(prevState => ({ ...prevState, active: !checkboxes.active }));
        };
        const handleHasColorCheckbox = () => {
            const list = [...productDetails];
            if (!checkboxes.hasColor) {
                for (let index = 0; index < list.length; index++) {
                    list[index].color = undefined;
                }
                setProductDetails(list);
            }
            setCheckboxes(prevState => ({ ...prevState, hasColor: !checkboxes.hasColor }));
        }
        function changeProductDetailImage(event, index) {
            const { value } = event.target;
            const list = [...productDetails];
            list[index].imagePath = value;
            if (value === '') {
                list[index].imageError = true;
                list[index].imageHelper = 'Image URL is required!';
            } else {
                list[index].imageError = false;
                list[index].imageHelper = 'Please insert an image url';
            }
            setProductDetails(list);
        }
        function changeProductDetailColor(event, index) {
            const { value } = event.target;
            const obj = colorsArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            const list = [...productDetails];
            list[index].color = obj;
            if (value === '') {
                list[index].colorError = true;
                list[index].colorHelper = 'Color is required!';
            } else {
                list[index].colorError = false;
                list[index].colorHelper = 'Please select a color';
            }
            setProductDetails(list);
        }
        function changeProductDetailSize(event, index) {
            const { value } = event.target;
            const obj = sizesArray.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim());
            const list = [...productDetails];
            list[index].size = obj;
            if (value === '') {
                list[index].sizeError = true;
                list[index].sizeHelper = 'Size is required!';
            } else {
                list[index].sizeError = false;
                list[index].sizeHelper = 'Please select a size';
            }
            setProductDetails(list);
        }
        function changeProductDetailPrice(event, index) {
            const { value } = event.target;
            if (value === '') {
                const list = [...productDetails];
                list[index].price = parseFloat(0);
                setProductDetails(list);
            } else if (parseFloat(value)) {
                const list = [...productDetails];
                list[index].price = parseFloat(value);
                setProductDetails(list);
            }
        }
        function changeProductDetailQuantity(event, index) {
            const { value } = event.target;
            if (value === '') {
                const list = [...productDetails];
                list[index].qty = parseFloat(0);
                setProductDetails(list);
            } else if (parseFloat(value)) {
                const list = [...productDetails];
                list[index].qty = parseFloat(value);
                setProductDetails(list);
            }
        }
        function changeProductDetailPreorder(event, index) {
            const list = [...productDetails];
            list[index].preOrder = !list[index].preOrder;
            setProductDetails(list);
        }
        const addRow = event => {
            event.preventDefault();
            setProductDetails([...productDetails, { imagePath: '', imageError: false, imageHelper: 'Please insert an image url', color: undefined, colorError: false, colorHelper: 'Please select a color', size: undefined, sizeError: false, sizeHelper: 'Please sleect a size', price: 0, qty: 0, preOrder: false }]);
        }
        const removeRow = event => {
            event.preventDefault();
            if (productDetails.length !== 1) {
                const list = [...productDetails];
                list.pop();
                setProductDetails(list);
            }
        }

        const onSubmit = async e => {
            e.preventDefault();
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/product/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ name: nameState.name, furtherSubCategory: furtherSubCategoryState.obj, brand: brandState.obj, points: pointsState.name, keywords: keywordsState.name, imagePath: imagePathState.name, description: descriptionState.name, active: checkboxes.active, hasColor: checkboxes.hasColor, productDetails: productDetails }),
                });
                const content = await response.json();
                setProductsArray([...productsArray, content.data]);
            } else {
                const oldProductDetails = [];
                editObj.productDetails.forEach(element => {
                    oldProductDetails.push(element._id);
                });
                const response = await fetch(`${api}/product/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    body: JSON.stringify({ _id: queryID, name: nameState.name, furtherSubCategory: furtherSubCategoryState.obj, brand: brandState.obj, points: pointsState.name, keywords: keywordsState.name, imagePath: imagePathState.name, description: descriptionState.name, active: checkboxes.active, hasColor: checkboxes.hasColor, productDetails: productDetails, oldProductDetails: oldProductDetails }),
                });
                const content = await response.json();
                const objArray = [...productsArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setProductsArray(objArray);
            }
            if (pressedBtn === 1) {
                history.push('/admin/product');
            }
            else {
                setNameState({ name: '', helperText: 'Enter name Ex. BACKSTAGE Face & Body Foundation', error: false });
                setFurtherSubCategoryState({ name: '', obj: undefined, helperText: 'Enter name Ex. Face', error: false });
                setBrandState({ name: '', obj: undefined, helperText: 'Enter name Ex. Dior', error: false });
                setPointsState({ name: '', helperText: 'Enter points Ex. 25', error: false })
                setKeywordsState({ name: '', helperText: 'Comma seperated SEO Keywords' });
                setImagePathState({ name: '', helperText: 'Please insert an image url Ex. https://www.sephora.com/productimages/sku/s2070571-main-zoom.jpg', error: false });
                setDescriptionState({ name: '', helperText: 'Type a description Ex. This product is...', error: false })
                setCheckboxes({ active: true, hasColor: true });
                setProductDetails([{ imagePath: '', imageError: false, imageHelper: 'Please insert an image url', color: undefined, colorError: false, colorHelper: 'Please select a color', size: undefined, sizeError: false, sizeHelper: 'Please sleect a size', price: 0, qty: 0, preOrder: false }]);
                setLoading(false);
                queryID = '';
                history.push('/admin/product/add');
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
                    <Form.Group as={Col} md={6} controlId="furtherSubCategory">
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="combo-box-demo"
                                color="secondary"
                                options={furtherSubCategoriesArray}
                                getOptionLabel={(option) => option.name}
                                value={furtherSubCategoryState.obj ? furtherSubCategoryState.obj : null}
                                // style={{ width: 300 }}
                                renderInput={(params) => <TextField
                                    color="secondary"
                                    error={furtherSubCategoryState.error}
                                    onChange={changeFurtherSubCategoryState}
                                    onBlur={changeFurtherSubCategoryState}
                                    {...params} label="Further sub category"
                                />
                                }
                            />
                            <FormHelperText error={furtherSubCategoryState.error} id="furtherSubCategory-helper">{furtherSubCategoryState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="brand">
                        <FormControl className={classes.formControl}>
                            <Autocomplete
                                id="combo-box-demo"
                                color="secondary"
                                options={brandsArray}
                                getOptionLabel={(option) => option.name}
                                value={brandState.obj ? brandState.obj : null}
                                // style={{ width: 300 }}
                                renderInput={(params) => <TextField
                                    color="secondary"
                                    error={brandState.error}
                                    onChange={changeBrandState}
                                    onBlur={changeBrandState}
                                    {...params} label="Brand"
                                />
                                }
                            />
                            <FormHelperText error={brandState.error} id="brand-helper">{brandState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="points">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={pointsState.error} color="secondary" htmlFor="points">Points</InputLabel>
                            <Input
                                color="secondary"
                                autoComplete="none"
                                value={pointsState.name}
                                type="text"
                                error={pointsState.error}
                                id="points"
                                name="points"
                                onChange={changePointsState}
                                onBlur={changePointsState}
                                aria-describedby="points-helper"
                            />
                            <FormHelperText error={pointsState.error} id="points-helper">{pointsState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={12} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={imagePathState.error} color="secondary" htmlFor="imagePathState">Image URL</InputLabel>
                            <Input
                                color="secondary"
                                autoComplete="none"
                                value={imagePathState.name}
                                type="text"
                                error={imagePathState.error}
                                id="imagePathState"
                                name="imagePathState"
                                onChange={changeImagePathState}
                                onBlur={changeImagePathState}
                                aria-describedby="imagePathState-helper"
                            />
                            <FormHelperText error={imagePathState.error} id="imagePathState-helper">{imagePathState.helperText}</FormHelperText>
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
                                error={descriptionState.error}
                                multiline
                                rows={10}
                                value={descriptionState.name}
                                aria-describedby="description-helper"
                            />
                            <FormHelperText error={descriptionState.error} id="description-helper">{descriptionState.helperText}</FormHelperText>
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
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="active">
                        <FormControlLabel
                            control={<Checkbox checked={checkboxes.hasColor} onChange={handleHasColorCheckbox} name="hasColor" />}
                            label="Has color"
                        />
                    </Form.Group>
                </Row>
            </fieldset>
            <fieldset>
                <legend>Product Details</legend>
                <IconButton onClick={addRow} variant="contained" color="secondary" aria-label="Add">
                    <AddCircleIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={removeRow} variant="contained" color="secondary" aria-label="Remove">
                    <RemoveCircleIcon fontSize="large" />
                </IconButton>
                {
                    productDetails.map((value, index) => (
                        <div key={index}>
                            <Row>
                                <Form.Group as={Col} md={3} controlId="name">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel error={value.imageError} color="secondary" htmlFor="imagePath">Image URL</InputLabel>
                                        <Input
                                            color="secondary"
                                            autoComplete="none"
                                            value={value.imagePath}
                                            type="text"
                                            onChange={event => changeProductDetailImage(event, index)}
                                            onBlur={event => changeProductDetailImage(event, index)}
                                            error={value.imageError}
                                            aria-describedby="imagePathState-helper"
                                        />
                                        <FormHelperText error={value.imageError} id="imagePath-helper">{value.imageHelper}</FormHelperText>
                                    </FormControl>
                                </Form.Group>
                                {
                                    checkboxes.hasColor ? (
                                        <Form.Group as={Col} md={2} controlId="color">
                                            <FormControl className={classes.formControl}>
                                                <Autocomplete
                                                    id="combo-box-demo"
                                                    color="secondary"
                                                    options={colorsArray}
                                                    getOptionLabel={(option) => option.name}
                                                    value={value.color ? value.color : null}
                                                    renderInput={(params) => <TextField
                                                        color="secondary"
                                                        onChange={event => changeProductDetailColor(event, index)}
                                                        // onChange={changeProductDetailColor}
                                                        onBlur={event => changeProductDetailColor(event, index)}
                                                        error={value.colorError}
                                                        {...params} label="Color"
                                                    />
                                                    }
                                                />
                                                <FormHelperText error={value.colorError} id="color-helper">{value.colorHelper}</FormHelperText>
                                            </FormControl>
                                        </Form.Group>
                                    ) : null
                                }
                                <Form.Group as={Col} md={2} controlId="size">
                                    <FormControl className={classes.formControl}>
                                        <Autocomplete
                                            id="combo-box-demo"
                                            color="secondary"
                                            options={sizesArray}
                                            getOptionLabel={(option) => option.name}
                                            value={value.size ? value.size : null}
                                            renderInput={(params) => <TextField
                                                color="secondary"
                                                onChange={event => changeProductDetailSize(event, index)}
                                                onBlur={event => changeProductDetailSize(event, index)}
                                                {...params} label="Size"
                                                error={value.sizeError}
                                            />
                                            }
                                        />
                                        <FormHelperText error={value.sizeError} id="size-helper">{value.sizeHelper}</FormHelperText>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} md={2} controlId="name">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel color="secondary" htmlFor="price">Price</InputLabel>
                                        <Input
                                            color="secondary"
                                            autoComplete="none"
                                            value={value.price}
                                            type="text"
                                            onChange={event => changeProductDetailPrice(event, index)}
                                            // onBlur={event => changeProductDetailPrice(event, index)}
                                            aria-describedby="name-helper"
                                        />
                                        <FormHelperText id="price">Enter a price</FormHelperText>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} md={1} controlId="name">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel color="secondary" htmlFor="price">quantity</InputLabel>
                                        <Input
                                            color="secondary"
                                            autoComplete="none"
                                            value={value.qty}
                                            type="text"
                                            onChange={event => changeProductDetailQuantity(event, index)}
                                            // onBlur={event => changeProductDetailQuantity(event, index)}
                                            aria-describedby="quantity-helper"
                                        />
                                        <FormHelperText id="price">Enter quantity</FormHelperText>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} md={2} controlId="preorder">
                                    <FormControlLabel
                                        control={<Checkbox checked={value.preOrder} onChange={event => changeProductDetailPreorder(event, index)} name="preorder" />}
                                        label="Pre-order"
                                    />
                                </Form.Group>
                            </Row>
                            <Divider className={classes.divider} />
                        </div>
                    ))
                }
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

export default productObj;