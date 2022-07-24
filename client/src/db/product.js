import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useHistory } from 'react-router-dom';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../src/db.scss';

const NestedArray = ({ nestIndex, control, register }) => {

    const { fields, remove, append } = useFieldArray({
        control,
        name: `productDetailsList[${nestIndex}].imageList`
    });

    return (
        <div>
            <label>Images:</label>
            <IconButton onClick={() => append()}
                variant="contained" color="primary" aria-label="Add">
                <AddCircleIcon fontSize="medium" />
            </IconButton>

            {fields.map((item, k) => {
                return (
                    <div key={k} >
                        <Row>
                            <Col md={1} style={{ width: 'fit-content' }}>
                                <IconButton onClick={() => { remove(k); }} variant="contained" color="primary" aria-label="Remove">
                                    <DeleteIcon fontSize="medium" />
                                </IconButton>
                            </Col>

                            <Form.Group as={Col} md={3} controlId={`image-${k}`}>
                                <FormControl >
                                    <InputLabel shrink color="secondary" htmlFor="imagePath">Image URL</InputLabel>
                                    <Input
                                        {...register(`productDetailsList[${nestIndex}].imageList[${k}]`, {})}
                                        color="secondary"
                                        autoComplete="none"
                                        type="text"
                                    />
                                </FormControl>
                            </Form.Group>
                        </Row>
                    </div>
                );

            })}

            <hr />
        </div>
    );
};



// ------

const createTableData = (data) => {
    const { _id, name, brand, active } = data;
    const brandName = brand.name;
    const categoryName = data.category.name;
    return { _id, name, brandName, categoryName, active };
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
        const response = await fetch(`${api}/product/set-active`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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



const productObj = {
    apiTable: `${api}/product/table-data`,
    deleteApi: `${api}/product/delete`,
    createTableData: createTableData,
    headCells: [
        { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'brand', numeric: false, disablePadding: false, label: 'Brand' },
        { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
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


        const [productsArray, setProductsArray] = useState([]);
        const [brandsArray, setBrandsArray] = useState([]);
        const [colorsArray, setColorsArray] = useState([]);
        const [sizesArray, setSizesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);
        const [changedProduct, setChangedProduct] = useState(false);

        const [defaultName, setDefaultName] = useState('');
        const [defaultImage, setDefaultImage] = useState('');
        const [defaultCategory, setDefaultCategory] = useState(null);
        const [defaultSubCategory, setDefaultSubCategory] = useState(null);
        const [defaultFurtherSubCategory, setDefaultFurtherSubCategory] = useState(null);
        const [defaultBrand, setDefaultBrand] = useState('');
        const [defaultProductDescription, setDefaultProductDescription] = useState('');
        const [defaultActive, setDefaultActive] = useState(true);
        const [defaultHasColor, setDefaultHasColor] = useState(true);
        const [defaultProductDetails, setDefaultProductDetails] = useState([
            {
                imageList: []
            }
        ]);

        const [defaultNewArrival, setDefaultNewArrival] = useState(true);
        const [defaultHotSeller, setDefaultHotSeller] = useState(false);

        const [hasColorChecked, setHasColorChecked] = useState(defaultHasColor);

        const [preOrderChecked, setPreOrderChecked] = useState([]);



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

        const [categoriesData, setCategoriesData] = useState({});

        useEffect(() => {
            (
                async () => {

                    const furtherSubCategoryData = await fetch(`${api}/further-sub-category/table-data`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        withCredentials: true,
                    });

                    const furtherSubCategories = await furtherSubCategoryData.json();

                    const subCategoryData = await fetch(`${api}/sub-category/table-data`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        withCredentials: true,
                    });

                    const subCategories = await subCategoryData.json();


                    const categoryData = await fetch(`${api}/category/table-data`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        withCredentials: true,
                    });

                    let data = {};

                    const categories = await categoryData.json();

                    data["categories"] = [];


                    categories.data.forEach(category => {
                        data["categories"].push({ "_id": category._id, "name": category.name });
                    })


                    subCategories.data.forEach(subCategory => {
                        let category = subCategory.category;

                        if (!data[category._id]) {
                            data[category._id] = {};
                            data[category._id]["subCategories"] = [];
                        }
                        data[category._id]["subCategories"].push({ "_id": subCategory._id, "name": subCategory.name });
                    })

                    furtherSubCategories.data.forEach(furtherSubCategory => {
                        let subCategory = furtherSubCategory.subCategory;
                        let category = furtherSubCategory.subCategory.category;

                        if (!data[category._id][subCategory._id]) {
                            data[category._id][subCategory._id] = [];
                        }
                        data[category._id][subCategory._id].push({ "_id": furtherSubCategory._id, "name": furtherSubCategory.name });
                    });

                    setCategoriesData(data);
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


        const [typedCategory, setTypedCategory] = useState(null);
        const [typedSubCategory, setTypedSubCategory] = useState(null);
        const [typedFurtherSubCategory, setTypedFurtherSubCategory] = useState(null);

        const [selectedCategory, setSelectedCategory] = useState(null);
        const [selectedSubCategory, setSelectedSubCategory] = useState(null);


        useEffect(() => {
            if (editObj) {
                setTypedCategory(editObj.category);
                setTypedSubCategory(editObj.subCategory);
                setTypedFurtherSubCategory(editObj.furtherSubCategory);

                setSelectedCategory(editObj?.category?._id);
                setSelectedSubCategory(editObj?.subCategory?._id);


                setDefaultName(editObj.name);
                setDefaultCategory(editObj.category);
                setDefaultImage(editObj.default_image);
                setDefaultSubCategory(editObj.subCategory);
                setDefaultFurtherSubCategory(editObj.furtherSubCategory);
                setDefaultBrand(editObj.brand);
                setDefaultProductDescription(editObj.product_description);
                setDefaultActive(editObj.active);
                setDefaultHasColor(editObj.hasColor);
                setHasColorChecked(editObj.hasColor);
                setDefaultProductDetails(editObj.productDetails);

                const list = [];
                editObj.productDetails.forEach(element => {
                    list.push(element);
                });
                setDefaultProductDetails(list);

                const checked_preorders = list?.map((element) => { return element?.preOrder });
                setPreOrderChecked(checked_preorders);

                setDefaultHotSeller(editObj?.hotSeller);
                setDefaultNewArrival(editObj?.newArrival);



            } else {

            }
        }, [editObj]);



        const availableCategories = (categoriesData["categories"]) ?? [];
        const availableSubCategories = (categoriesData[selectedCategory] ? categoriesData[selectedCategory]["subCategories"] : []) ?? [];
        const availableFurtherSubCategories = (categoriesData[selectedCategory] ? categoriesData[selectedCategory][selectedSubCategory] : []) ?? [];


        const {
            control,
            register,
            handleSubmit,
            getValues,
            formState: { errors },
            reset,
        } = useForm({
            defaultValues: {
                productDetailsList: defaultProductDetails,
            }
        });

        const { fields, append, remove } = useFieldArray({
            control,
            name: "productDetailsList"
        });


        const addRow = () => {
            append({ color: null, size: null, price: 0, points: 0, quantity: 0, preOrder: false, imagesList: [] });
        }


        useEffect(() => {
            reset({ ...getValues(), productDetailsList: defaultProductDetails });
        }, [defaultProductDetails, getValues, reset]);


        const onSubmit = async (data) => {


            let list_products = [];

            data?.productDetailsList.forEach((element) => {
                let product = element;
                product["quantity"] = parseInt(product?.["quantity"]);
                product["price"] = parseInt(product?.["price"]);
                product["points"] = parseInt(product?.["points"]);
                list_products.push(product);
            });


            data["productDetailsList"] = list_products;

            setLoading(true);

            if (queryID === '') {
                const response = await fetch(`${api}/product/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({
                        name: data.name,
                        category: data.category,
                        product_description: data.product_description,
                        subCategory: data.subCategory ?? null,
                        furtherSubCategory: data.furtherSubCategory ?? null,
                        keywords: "",
                        default_image: data.default_image,
                        description: "",
                        active: data.active,
                        productDetails: data.productDetailsList,
                        hasColor: data.hasColor,
                        brand: data.brand,
                        hotSeller: data.hotSeller,
                        newArrival: data.newArrival,
                    }),
                });
                const content = await response.json();
                setProductsArray([...productsArray, content.data]);
            } else {
                const response = await fetch(`${api}/product/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({
                        _id: queryID,
                        name: data.name,
                        category: data.category,
                        product_description: data.product_description,
                        default_image: data.default_image,
                        subCategory: data.subCategory ?? null,
                        furtherSubCategory: data.furtherSubCategory ?? null,
                        keywords: "",
                        description: "",
                        active: data.active,
                        productDetails: data.productDetailsList,
                        hasColor: data.hasColor,
                        brand: data.brand,
                        hotSeller: data.hotSeller,
                        newArrival: data.newArrival,
                    }),
                });
                const content = await response.json();
                const objArray = [...productsArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setProductsArray(objArray);
            }
            reset();
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/product`,
                        state: { data: 'added', name: data.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/product`,
                        state: { data: 'edited', name: data.name }
                    });
                }
            }
            else {
                setLoading(false);
                history.push('/admin/product/add');
            }
        }

        const [editorState, setEditorState] = useState(
            () => EditorState.createEmpty(),
        );

        const htmlToDraftBlocks = (html) => {
            const blocksFromHtml = htmlToDraft(html);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            return editorState;
        }


        useEffect(() => {
            setEditorState(htmlToDraftBlocks(defaultProductDescription));
        }, [defaultProductDescription])


        const handleEditorChange = (state) => {
            setEditorState(state);
        }

        const draft_html_content = (state) => {
            const currentContent = state.getCurrentContent();
            let currentContentAsHTML = draftToHtml(convertToRaw(currentContent));
            return currentContentAsHTML
        }



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
                                <FormHelperText id="name-helper">Enter name Ex. BACKSTAGE Face & Body Foundation</FormHelperText>
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
                                        value={typedCategory}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={availableCategories}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => { setTypedCategory(data); props.field.onChange(data); setSelectedCategory(data?._id); setTypedSubCategory(null); setTypedFurtherSubCategory(null); }}
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
                                <FormHelperText id="name-helper">Select category</FormHelperText>
                            }
                            <FormHelperText error={errors.category ? true : false} id="name-helper">{errors.category && <>{errors.category.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="subCategory">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultSubCategory : undefined}
                                        value={typedSubCategory}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={availableSubCategories}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => { setTypedSubCategory(data); props.field.onChange(data); setSelectedSubCategory(data?._id); setTypedFurtherSubCategory(null); }}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors.subCategory ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Sub Category"
                                            />
                                        }
                                    />
                                )}
                                onChange={([, data]) => data}
                                defaultValue={defaultSubCategory}
                                name={"subCategory"}
                                control={control}
                            />
                            {!errors.subCategory &&
                                <FormHelperText id="name-helper">Select Sub Category</FormHelperText>
                            }
                            <FormHelperText error={errors.subCategory ? true : false} id="name-helper">{errors.subCategory && <>{errors.subCategory.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>


                    <Form.Group as={Col} md={6} controlId="furtherSubCategory">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultFurtherSubCategory : undefined}
                                        value={typedFurtherSubCategory}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={availableFurtherSubCategories}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => { setTypedFurtherSubCategory(data); props.field.onChange(data); }}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors.furtherSubCategory ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Further Sub Category"
                                            />
                                        }
                                    />
                                )}
                                onChange={([, data]) => data}
                                defaultValue={defaultFurtherSubCategory}
                                name={"furtherSubCategory"}
                                control={control}
                            />
                            {!errors.furtherSubCategory &&
                                <FormHelperText id="name-helper">Select Further Sub Category</FormHelperText>
                            }
                            <FormHelperText error={errors.furtherSubCategory ? true : false} id="name-helper">{errors.furtherSubCategory && <>{errors.furtherSubCategory.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="brand">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultBrand : undefined}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={brandsArray}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => props.field.onChange(data)}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors.brand ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Brand"
                                            />
                                        }
                                    />
                                )}
                                rules={{ required: "Brand is required!" }}
                                onChange={([, data]) => data}
                                defaultValue={defaultBrand}
                                name={"brand"}
                                control={control}
                            />
                            {!errors.brand &&
                                <FormHelperText id="name-helper">Select Brand</FormHelperText>
                            }
                            <FormHelperText error={errors.brand ? true : false} id="name-helper">{errors.brand && <>{errors.brand.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>

                    <Form.Group as={Col} md={3} controlId={`default_image`}>
                        <FormControl >
                            <InputLabel color="secondary" htmlFor="imagePath">Default Image URL</InputLabel>
                            <Input
                                error={errors.default_image ? true : false}
                                defaultValue={editObj ? defaultImage : undefined}
                                {...register(`default_image`, { required: true })}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                            />
                            {!errors[`default_image`] &&
                                <FormHelperText >Enter Image url</FormHelperText>
                            }
                            <FormHelperText error={errors[`default_image`] ? true : false}>{errors[`default_image`] && <>{errors[`default_image`].message}</>}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>

                <legend>Product Description</legend>
                <Row style={{ marginTop: '1rem' }} className={classes.rowGap}>
                    <Form.Group controlId="product_description">
                        <FormControl className={classes.formControl}>
                            <div>
                                <Controller
                                    name={"product_description"}
                                    control={control}
                                    defaultValue={editObj ? defaultProductDescription : undefined}
                                    rules={{ required: "Product Description is required!" }}
                                    render={(props) => (
                                        <Editor
                                            editorState={editorState}
                                            onEditorStateChange={(c) => { handleEditorChange(c); props.field.onChange(draft_html_content(c)); }}
                                            wrapperClassName="wrapper-class"
                                            editorClassName="editor-class"
                                            toolbarClassName="toolbar-class"
                                        />
                                    )}
                                />
                            </div>

                            {!errors.product_description &&
                                <FormHelperText id="name-helper">Type product description in the editor</FormHelperText>
                            }
                            <FormHelperText error={errors.product_description ? true : false} id="name-helper">{errors.product_description && <>{errors.product_description.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>


                <Row style={{ marginTop: '1.2rem' }} className={classes.rowGap}>
                    <Form.Group as={Col} md={3} controlId="active">
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


                    <Form.Group as={Col} md={3} controlId="active">
                        <FormControlLabel
                            control={
                                <Controller
                                    name={"hasColor"}
                                    control={control}
                                    defaultValue={defaultHasColor}
                                    render={(props) => (
                                        <Checkbox
                                            checked={props.field.value}
                                            onChange={(e) => { props.field.onChange(e.target.checked); setHasColorChecked(e.target.checked); }}
                                        />
                                    )}
                                />
                            }
                            label={"Has Color"}
                        />
                    </Form.Group>



                    <Form.Group as={Col} md={3} controlId="active">
                        <FormControlLabel
                            control={
                                <Controller
                                    name={"hotSeller"}
                                    control={control}
                                    defaultValue={defaultHotSeller}
                                    render={(props) => (
                                        <Checkbox
                                            checked={props.field.value}
                                            onChange={(e) => { props.field.onChange(e.target.checked); }}
                                        />
                                    )}
                                />
                            }
                            label={"Hot Seller"}
                        />
                    </Form.Group>


                    <Form.Group as={Col} md={3} controlId="active">
                        <FormControlLabel
                            control={
                                <Controller
                                    name={"newArrival"}
                                    control={control}
                                    defaultValue={defaultNewArrival}
                                    render={(props) => (
                                        <Checkbox
                                            checked={props.field.value}
                                            onChange={(e) => { props.field.onChange(e.target.checked); }}
                                        />
                                    )}
                                />
                            }
                            label={"New Arrival"}
                        />
                    </Form.Group>
                </Row>

            </fieldset>


            <fieldset>
                <legend>Product Details</legend>
                <hr />
                <IconButton onClick={() => { addRow(); }} variant="contained" color="secondary" aria-label="Add">
                    <AddCircleIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={() => { remove(-1); }} variant="contained" color="secondary" aria-label="Remove">
                    <RemoveCircleIcon fontSize="large" />
                </IconButton>


                {fields.map((item, index) => {

                    return (
                        <div key={index}>
                            <Row style={{ marginTop: '1rem' }}>
                                <Col md={1} style={{ width: 'fit-content' }}>
                                    <IconButton onClick={() => { remove(index) }} variant="contained" color="secondary" aria-label="Remove">
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                </Col>
                                {
                                    hasColorChecked ? (
                                        <Form.Group as={Col} md={2} controlId="color">
                                            <FormControl className={classes.formControl}>

                                                <Controller
                                                    render={(props) => (
                                                        <Autocomplete
                                                            defaultValue={editObj ? defaultProductDetails?.[index]?.color : undefined}
                                                            isOptionEqualToValue={(option, value) => option._id === value._id}
                                                            id="combo-box-demo"
                                                            color="secondary"
                                                            options={colorsArray}
                                                            getOptionLabel={(option) => option.name}
                                                            onChange={(e, data) => props.field.onChange(data)}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    error={errors[`productDetailsList[${index}].color`] ? true : false}
                                                                    color="secondary"
                                                                    {...params}
                                                                    label="Color"
                                                                />
                                                            }
                                                        />
                                                    )}
                                                    rules={{ required: "Color is required!" }}
                                                    onChange={([, data]) => data}
                                                    defaultValue={''}
                                                    name={`productDetailsList[${index}].color`}
                                                    control={control}
                                                />
                                                {!errors[`productDetailsList[${index}].color`] &&
                                                    <FormHelperText id="name-helper">Select Color</FormHelperText>
                                                }
                                                <FormHelperText error={errors[`productDetailsList[${index}].color`] ? true : false} id="name-helper">{errors[`productDetailsList[${index}].color`] && <>{errors[`productDetailsList[${index}].color`].message}</>}</FormHelperText>


                                            </FormControl>
                                        </Form.Group>
                                    ) : null
                                }
                                <Form.Group as={Col} md={2} controlId="size">
                                    <FormControl className={classes.formControl}>
                                        <Controller
                                            render={(props) => (
                                                <Autocomplete
                                                    defaultValue={editObj ? defaultProductDetails?.[index]?.size : undefined}
                                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                                    id="combo-box-demo"
                                                    color="secondary"
                                                    options={sizesArray}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={(e, data) => props.field.onChange(data)}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            error={errors[`productDetailsList[${index}].color`] ? true : false}
                                                            color="secondary"
                                                            {...params}
                                                            label="Size"
                                                        />
                                                    }
                                                />
                                            )}
                                            rules={{ required: "Size is required!" }}
                                            onChange={([, data]) => data}
                                            defaultValue={''}
                                            name={`productDetailsList[${index}].size`}
                                            control={control}
                                        />
                                        {!errors[`productDetailsList[${index}].size`] &&
                                            <FormHelperText id="name-helper">Select Size</FormHelperText>
                                        }
                                        <FormHelperText error={errors[`productDetailsList[${index}].size`] ? true : false} id="name-helper">{errors[`productDetailsList[${index}].size`] && <>{errors[`productDetailsList[${index}].size`].message}</>}</FormHelperText>

                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} md={1} controlId="name">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel color="secondary" htmlFor="price">Price</InputLabel>
                                        <Input
                                            {...register(`productDetailsList[${index}].price`, {
                                                required: "Price is required!",
                                            })}
                                            color="secondary"
                                            autoComplete="none"
                                            type="text"
                                            aria-describedby="name-helper"
                                        />
                                        <FormHelperText id="price">Enter a price</FormHelperText>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} md={1} controlId="points">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel color="secondary" htmlFor="price">Points</InputLabel>
                                        <Input
                                            {...register(`productDetailsList[${index}].points`, {
                                                required: "Points is required!",
                                            })}
                                            color="secondary"
                                            autoComplete="none"
                                            type="text"
                                            aria-describedby="points-helper"
                                        />
                                        <FormHelperText id="price">Enter points</FormHelperText>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} md={1} controlId="name">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel color="secondary" htmlFor="price">quantity</InputLabel>
                                        <Input
                                            {...register(`productDetailsList[${index}].quantity`, {
                                                required: "quantity is required!",
                                            })}
                                            color="secondary"
                                            autoComplete="none"
                                            type="text"
                                            aria-describedby="quantity-helper"
                                        />
                                        <FormHelperText id="price">Enter quantity</FormHelperText>
                                    </FormControl>
                                </Form.Group>


                                {preOrderChecked[index] &&
                                    <Form.Group as={Col} md={2} controlId="name">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel color="secondary" htmlFor="price">Preorder Price</InputLabel>
                                            <Input
                                                {...register(`productDetailsList[${index}].preOrderPrice`, {
                                                    required: "preorder price is required!",
                                                })}
                                                color="secondary"
                                                autoComplete="none"
                                                type="text"
                                                aria-describedby="quantity-helper"
                                            />
                                            <FormHelperText id="price">Enter preorder price</FormHelperText>
                                        </FormControl>
                                    </Form.Group>
                                }

                                <Form.Group as={Col} md={2} controlId="preOrder">
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name={`productDetailsList[${index}].preOrder`}
                                                control={control}
                                                defaultValue={false}
                                                render={(props) => (
                                                    <Checkbox
                                                        checked={props.field.value}
                                                        onChange={(e) => {
                                                            props.field.onChange(e.target.checked);
                                                            let lst = preOrderChecked;
                                                            lst[index] = e.target.checked;
                                                            setPreOrderChecked(lst);
                                                            setChangedProduct(!changedProduct);
                                                            reset({ ...getValues(), [`productDetailsList[${index}].preOrderPrice`]: "" });
                                                        }}
                                                    />
                                                )}
                                            />
                                        }
                                        label={"Pre Order"}
                                    />
                                </Form.Group>
                            </Row>
                            <NestedArray nestIndex={index} {...{ control, register }} />
                        </div>
                    );
                })}

            </fieldset>
            {/* 
            <Row style={{ marginTop: '1rem' }} className={classes.rowGap}>
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

            <Row style={{ marginTop: '1rem' }} className={classes.rowGap}>
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
                        <FormHelperText id="description-helper">Type a description for SEO Ex. This product is...</FormHelperText>
                    </FormControl>
                </Form.Group>
            </Row> */}


            <Button className={classes.button} onClick={_ => setPressedBtn(1)} type="submit" variant="contained" color="primary">
                Save
            </Button>

            <Button onClick={_ => setPressedBtn(2)} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </Form>);
    },
}

export default productObj;