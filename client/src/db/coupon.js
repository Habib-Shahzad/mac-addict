
import { FormControl, Input, InputLabel, FormHelperText, Button, TextField, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useHistory } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import api from '../api';
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const createTableData = (data) => {
    const { _id, name, type, amountOff, percentOff, timesRedeeemed, appliedToProducts, hasPromotionCodes } = data;
    return { _id, name, type, amountOff, percentOff, timesRedeeemed, appliedToProducts, hasPromotionCodes };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {

}

// const editObjCheck = (data, value, editObj) => {
//     if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
//     else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
// }

const provinceObj = {
    apiTable: `${api}/coupon/table-data`,
    deleteApi: `${api}/coupon/delete`,
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'type', numeric: false, disablePadding: true, label: 'Type' },
        { id: 'amountOff', numeric: false, disablePadding: true, label: 'Amount Off' },
        { id: 'percentOff', numeric: false, disablePadding: true, label: 'Percent Off' },
        { id: 'timesRedeeemed', numeric: false, disablePadding: true, label: 'Times Redeemed' },
        { id: 'appliedToProducts', numeric: false, disablePadding: true, label: 'Applied To Products' },
        { id: 'hasPromotionCodes', numeric: false, disablePadding: true, label: 'Has Promotion Codes' },

    ],
    ManyChild: '',
    checkboxSelection: '_id',
    Delete: function (items) { },
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Coupon',
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

        const [couponsArray, setCouponsArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        const [productsArray, setProductsArray] = useState([]);


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
                    setProductsArray(content.data);
                })();
        }, [queryID]);



        const [defaultName, setDefaultName] = useState('');
        const [defaultType, setDefaultType] = useState('');
        const [defaultAmountOff, setDefaultAmountOff] = useState('');
        const [defaultPercentOff, setDefaultPercentOff] = useState('');
        const [defaultRedeemBy, setDefaultRedeemBy] = useState('');
        const [defaultMaxRedemptions, setDefaultMaxRedemptions] = useState('');
        // const [defaultTimesRedeeemed, setDefaultTimesRedeeemed] = useState('');

        const [defaultAppliedToProducts, setDefaultAppliedToProducts] = useState(false);
        const [defaultProducts, setDefaultProducts] = useState([]);

        const [defaultHasPromotionCodes, setDefaultHasPromotionCodes] = useState(false);
        const [defaultPromotionCodes, setDefaultPromotionCodes] = useState([]);


        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/coupon/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setCouponsArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);



        const [availableProductDetails, setAvailableProductDetails] = useState([]);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultType(editObj.type);
                setDefaultAmountOff(editObj.amountOff);
                setDefaultPercentOff(editObj.percentOff);
                setDefaultRedeemBy(editObj.redeemBy);
                setDefaultMaxRedemptions(editObj.maxRedemptions);
                setDefaultAppliedToProducts(editObj.appliedToProducts);
                setDefaultHasPromotionCodes(editObj.hasPromotionCodes);
                setDefaultPromotionCodes(editObj.promotionCodes);


                let productDetailsList = [];
                let matchProductDetails = [];

                editObj.products.forEach((productObj) => {
                    productDetailsList.push(productObj.product.productDetails);

                    const product_detail_id = productObj.product_detail;
                    const productDetail = productObj.product.productDetails.find(productDetailObj => productDetailObj._id === product_detail_id);
                    matchProductDetails.push({ product: productObj.product, product_detail: productDetail });
                });


                setDefaultProducts(matchProductDetails);
                setAvailableProductDetails(productDetailsList);

            } else {

            }
        }, [editObj]);

        const {
            control,
            register,
            handleSubmit,
            formState: { errors },
            getValues,
            reset,
        } = useForm({
            defaultValues: {
                productsList: defaultProducts,
                promoCodesList: defaultPromotionCodes,
            }
        });

        const { fields: productsFields, append: productsAppend, remove: productsRemove } = useFieldArray({
            control,
            name: "productsList"
        });


        const { fields: promosFields, append: promosAppend, remove: promosRemove } = useFieldArray({
            control,
            name: "promoCodesList"
        });


        useEffect(() => {
            reset({ ...getValues(), promoCodesList: defaultPromotionCodes });
        }, [defaultPromotionCodes, getValues, reset]);


        useEffect(() => {
            reset({ ...getValues(), productsList: defaultProducts });
        }, [defaultProducts, getValues, reset]);


        const [changedProduct, setChangedProduct] = useState(false);


        useEffect(() => {
            // console.log(couponsArray);
        }, [couponsArray])

        const addProductsRow = () => {
            productsAppend({ product: '', product_detail: '' });
        }

        const addPromoRow = () => {
            promosAppend({
                code: '',
                expiresAt: null,
                maxRedemptions: '',
                firstTimeTransaction: false,
                minAmount: '',
                timesRedeeemed: '',
                active: true,
            }
            );
        }



        const onSubmit = async (data) => {

            setLoading(true);

            if (queryID === '') {
                const response = await fetch(`${api}/coupon/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({
                        name: data.name,
                        type: data.type,
                        amountOff: data.amountOff,
                        percentOff: data.percentOff,
                        redeemBy: data.redeemBy,
                        maxRedemptions: data.maxRedemptions,
                        appliedToProducts: data.appliedToProducts,
                        products: data.productsList,
                        hasPromotionCodes: data.hasPromotionCodes,
                        promotionCodes: data.promoCodesList,
                    }),
                });
                const content = await response.json();
                setCouponsArray([...couponsArray, content.data]);
            } else {
                const response = await fetch(`${api}/coupon/update`, {
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
                        type: data.type,
                        amountOff: data.amountOff,
                        percentOff: data.percentOff,
                        redeemBy: data.redeemBy,
                        maxRedemptions: data.maxRedemptions,
                        appliedToProducts: data.appliedToProducts,
                        products: data.productsList,
                        hasPromotionCodes: data.hasPromotionCodes,
                        promotionCodes: data.promoCodesList,
                    }),
                });
                const content = await response.json();
                const objArray = [...couponsArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setCouponsArray(objArray);
            }
            reset();
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/coupon`,
                        state: { data: 'added', name: data.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/coupon`,
                        state: { data: 'edited', name: data.name }
                    });
                }
            }
            else {
                setLoading(false);
                history.push('/admin/coupon/add');
            }
        }

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
                                <FormHelperText id="name-helper">Enter name Ex. Winter Sale</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>



                    <Form.Group as={Col} md={6} controlId="type">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultType : undefined}
                                        isOptionEqualToValue={(option, value) => option === value}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={["Percentage", "Fixed Amount"]}
                                        getOptionLabel={(option) => option}
                                        onChange={(e, data) => props.field.onChange(data)}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors?.type ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Type"
                                            />
                                        }
                                    />
                                )}
                                rules={{ required: "Type is required!" }}
                                onChange={([, data]) => data}
                                defaultValue={defaultType}
                                name={"type"}
                                control={control}
                            />
                            {!errors?.type &&
                                <FormHelperText id="name-helper">Select Type</FormHelperText>
                            }
                            <FormHelperText error={errors?.type ? true : false} id="name-helper">{errors?.type && <>{errors?.type.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>

                    {/* 

                    <Form.Group as={Col} md={6} controlId="type">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.type ? true : false} color="secondary" htmlFor="name">Type</InputLabel>
                            <Input
                                {...register("type", {
                                    required: "Type is required!",
                                })}
                                defaultValue={defaultType}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                                error={errors.type ? true : false}
                                aria-describedby="type-helper"
                            />
                            {!errors.type &&
                                <FormHelperText id="type-helper">Enter type</FormHelperText>
                            }
                            <FormHelperText error={errors.type ? true : false} id="type-helper">{errors.type && <>{errors.type.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group> */}

                </Row>

                <Row className={classes.rowGap}>

                    <Form.Group as={Col} md={6} controlId="amountOff">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.amountOff ? true : false} color="secondary" htmlFor="name">Amount Off</InputLabel>
                            <Input
                                {...register("amountOff", {
                                    required: "Amount Off is required!",
                                })}
                                defaultValue={defaultAmountOff}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                                error={errors.amountOff ? true : false}
                                aria-describedby="amountOff-helper"
                            />
                            {!errors.amountOff &&
                                <FormHelperText id="amountOff-helper">Enter Amount Off</FormHelperText>
                            }
                            <FormHelperText error={errors.amountOff ? true : false} id="amountOff-helper">{errors.amountOff && <>{errors.amountOff.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>


                    <Form.Group as={Col} md={6} controlId="percentOff">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.percentOff ? true : false} color="secondary" htmlFor="name">Percent Off</InputLabel>
                            <Input
                                {...register("percentOff", {
                                    required: "Percent Off is required!",
                                })}
                                defaultValue={defaultPercentOff}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                                error={errors.percentOff ? true : false}
                                aria-describedby="percentOff-helper"
                            />
                            {!errors.percentOff &&
                                <FormHelperText id="percentOff-helper">Enter Percent Off</FormHelperText>
                            }
                            <FormHelperText error={errors.percentOff ? true : false} id="percentOff-helper">{errors.percentOff && <>{errors.percentOff.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>

                </Row>

                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="redeemBy">
                        <FormControl className={classes.formControl}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Controller
                                    render={(props) => (
                                        <MobileDatePicker
                                            error={errors.redeemBy ? true : false}
                                            label="Redeem By"
                                            inputFormat="dd/MM/yyyy"
                                            defaultValue={defaultRedeemBy}
                                            value={props.field.value}
                                            onChange={(data) => { props.field.onChange(data); }}
                                            renderInput={(params) => <TextField
                                                color="secondary"
                                                autoComplete="none"
                                                aria-describedby="redeemBy-helper"
                                                {...params}
                                            />}
                                        />
                                    )}
                                    rules={{ required: "Redeem By is required!" }}
                                    onChange={([, data]) => data}
                                    defaultValue={defaultRedeemBy}
                                    name={"redeemBy"}
                                    control={control}
                                />
                            </LocalizationProvider>
                            {!errors.redeemBy &&
                                <FormHelperText id="redeemBy-helper">Enter Redeem By</FormHelperText>
                            }
                            <FormHelperText error={errors.redeemBy ? true : false} id="percentOff-helper">{errors.redeemBy && <>{errors.redeemBy.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>



                    <Form.Group as={Col} md={6} controlId="maxRedemptions">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.maxRedemptions ? true : false} color="secondary" htmlFor="name">Max Redemptions</InputLabel>
                            <Input
                                {...register("maxRedemptions", {
                                    required: "Max Redemptions is required!",
                                })}
                                defaultValue={defaultMaxRedemptions}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                                error={errors.maxRedemptions ? true : false}
                                aria-describedby="maxRedemptions-helper"
                            />
                            {!errors.maxRedemptions &&
                                <FormHelperText id="maxRedemptions-helper">Enter Max Redemptions</FormHelperText>
                            }
                            <FormHelperText error={errors.maxRedemptions ? true : false} id="maxRedemptions-helper">{errors.maxRedemptions && <>{errors.maxRedemptions.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>


                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="appliedToProducts">

                        <FormControlLabel
                            control={
                                <Controller
                                    name={"appliedToProducts"}
                                    control={control}
                                    defaultValue={defaultAppliedToProducts}
                                    render={(props) => (
                                        <Checkbox
                                            checked={props.field.value}
                                            onChange={(e) => props.field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                            label={"Applied to Products"}
                        />
                    </Form.Group>
                </Row>


                <fieldset>
                    <legend>List of Products</legend>
                    <IconButton onClick={() => { addProductsRow(); }} variant="contained" color="secondary" aria-label="Add">
                        <AddCircleIcon fontSize="large" />
                    </IconButton>
                    <IconButton onClick={() => { productsRemove(-1); }} variant="contained" color="secondary" aria-label="Remove">
                        <RemoveCircleIcon fontSize="large" />
                    </IconButton>

                    <hr />
                    {productsFields.map((item, index) => {

                        return (
                            <div key={index}>

                                <Row style={{ marginTop: '1rem' }}>

                                    <Form.Group as={Col} md={6} controlId="product">
                                        <FormControl className={classes.formControl}>

                                            <Controller
                                                render={(props) => (
                                                    <Autocomplete
                                                        defaultValue={editObj ? defaultProducts?.[index]?.product : undefined}
                                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                                        id="combo-box-demo"
                                                        color="secondary"
                                                        options={productsArray}
                                                        getOptionLabel={(option) => option.name}
                                                        onChange={(e, data) => {
                                                            let lst = availableProductDetails;
                                                            lst[index] = data?.productDetails;
                                                            setAvailableProductDetails(lst);
                                                            setChangedProduct(!changedProduct);
                                                            props.field.onChange(data?._id);
                                                            reset({ ...getValues(), [`productsList[${index}].product_detail`]: "" });
                                                        }}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                error={errors[`productsList[${index}].product`] ? true : false}
                                                                color="secondary"
                                                                {...params}
                                                                label="Product"
                                                            />
                                                        }
                                                    />
                                                )}
                                                rules={{ required: "Product is required!" }}
                                                onChange={([, data]) => data}
                                                defaultValue={''}
                                                name={`productsList[${index}].product`}
                                                control={control}
                                            />
                                            {!errors[`productsList[${index}].product`] &&
                                                <FormHelperText id="name-helper">Select Product</FormHelperText>
                                            }
                                            <FormHelperText error={errors[`productsList[${index}].product`] ? true : false} id="name-helper">{errors[`productsList[${index}].product`] && <>{errors[`productsList[${index}].product`].message}</>}</FormHelperText>


                                        </FormControl>
                                    </Form.Group>

                                </Row>


                                {availableProductDetails[index] &&
                                    <Row style={{ marginTop: '1rem' }}>

                                        <Form.Group as={Col} md={6} controlId="product">
                                            <FormControl className={classes.formControl}>

                                                <Controller
                                                    render={(props) => (
                                                        <Autocomplete
                                                            defaultValue={editObj ? defaultProducts?.[index]?.product_detail : undefined}
                                                            isOptionEqualToValue={(option, value) => option._id === value._id}
                                                            id="combo-box-demo"
                                                            color="secondary"
                                                            options={availableProductDetails[index] ?? []}
                                                            getOptionLabel={(option) => `${option?.size?.name} - ${option?.color?.name}`}
                                                            onChange={(e, data) => {
                                                                props.field.onChange(data?._id);
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    error={errors[`productsList[${index}].product_detail`] ? true : false}
                                                                    color="secondary"
                                                                    {...params}
                                                                    label="Product Detail"
                                                                />
                                                            }
                                                        />
                                                    )}
                                                    rules={{ required: "Product Detail is required!" }}
                                                    onChange={([, data]) => data}
                                                    defaultValue={''}
                                                    name={`productsList[${index}].product_detail`}
                                                    control={control}
                                                />
                                                {!errors[`productsList[${index}].product_detail`] &&
                                                    <FormHelperText id="name-helper">Select Product Detail</FormHelperText>
                                                }
                                                <FormHelperText error={errors[`productsList[${index}].product_detail`] ? true : false} id="name-helper">{errors[`productsList[${index}].product_detail`] && <>{errors[`productsList[${index}].product_detail`].message}</>}</FormHelperText>


                                            </FormControl>
                                        </Form.Group>

                                    </Row>
                                }

                                <hr />
                            </div>
                        );

                    }
                    )
                    }




                </fieldset>



                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="hasPromotionCodes">

                        <FormControlLabel
                            control={
                                <Controller
                                    name={"hasPromotionCodes"}
                                    control={control}
                                    defaultValue={defaultHasPromotionCodes}
                                    render={(props) => (
                                        <Checkbox
                                            checked={props.field.value}
                                            onChange={(e) => props.field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                            label={"Has Promotion Codes"}
                        />
                    </Form.Group>
                </Row>



                <fieldset>
                    <legend>List of Promotion Codes</legend>
                    <IconButton onClick={() => { addPromoRow(); }} variant="contained" color="secondary" aria-label="Add">
                        <AddCircleIcon fontSize="large" />
                    </IconButton>
                    <IconButton onClick={() => { promosRemove(-1); }} variant="contained" color="secondary" aria-label="Remove">
                        <RemoveCircleIcon fontSize="large" />
                    </IconButton>

                    <hr />
                    {
                        promosFields.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Row className={classes.rowGap}>
                                        <Form.Group as={Col} md={5} controlId="code">

                                            <FormControl className={classes.formControl}>
                                                <InputLabel error={errors[`promoCodesList[${index}].code`] ? true : false} color="secondary" htmlFor="code">Code</InputLabel>
                                                <Input
                                                    {...register(`promoCodesList[${index}].code`, {
                                                        required: "Code is required!",
                                                    })}
                                                    color="secondary"
                                                    autoComplete="none"
                                                    type="text"
                                                    error={errors[`promoCodesList[${index}].code`] ? true : false}
                                                    aria-describedby="code-helper"
                                                />
                                                {
                                                    !errors[`promoCodesList[${index}].code`] &&
                                                    <FormHelperText id="name-helper">Enter Promotion Code</FormHelperText>
                                                }
                                                <FormHelperText error={errors[`promoCodesList[${index}].code`] ? true : false} id="name-helper">{errors[`promoCodesList[${index}].code`] && <>{errors[`promoCodesList[${index}].code`].message}</>}</FormHelperText>

                                            </FormControl>
                                        </Form.Group>


                                        <Form.Group as={Col} md={6} controlId="expiresAt">
                                            <FormControl className={classes.formControl}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Controller
                                                        render={(props) => {
                                                            return (
                                                                <MobileDatePicker
                                                                    error={errors[`promoCodesList[${index}].expiresAt`] ? true : false}
                                                                    label="Expires At"
                                                                    inputFormat="dd/MM/yyyy"
                                                                    value={props.field.value}
                                                                    onChange={(data) => { props.field.onChange(data); }}
                                                                    renderInput={(params) => <TextField
                                                                        color="secondary"
                                                                        autoComplete="none"
                                                                        {...params}
                                                                    />}
                                                                />
                                                            );
                                                        }}
                                                        rules={{ required: "Expires At is required!" }}
                                                        onChange={([, data]) => data}
                                                        name={`promoCodesList[${index}].expiresAt`}
                                                        control={control}
                                                    />
                                                </LocalizationProvider>
                                                {
                                                    !errors[`promoCodesList[${index}].expiresAt`] &&
                                                    <FormHelperText id="name-helper">Enter Expiry Date</FormHelperText>
                                                }
                                                <FormHelperText error={errors[`promoCodesList[${index}].expiresAt`] ? true : false} id="name-helper">{errors[`promoCodesList[${index}].expiresAt`] && <>{errors[`promoCodesList[${index}].expiresAt`].message}</>}</FormHelperText>

                                            </FormControl>
                                        </Form.Group>

                                    </Row>

                                    <Row className={classes.rowGap}>
                                        <Form.Group as={Col} md={5} controlId="maxRedemptions">

                                            <FormControl className={classes.formControl}>
                                                <InputLabel error={errors[`promoCodesList[${index}].maxRedemptions`] ? true : false} color="secondary" htmlFor="maxRedemptions">Max Redemptions</InputLabel>
                                                <Input
                                                    {...register(`promoCodesList[${index}].maxRedemptions`, {
                                                        required: "Code is required!",
                                                    })}
                                                    color="secondary"
                                                    autoComplete="none"
                                                    type="text"
                                                    error={errors[`promoCodesList[${index}].maxRedemptions`] ? true : false}
                                                    aria-describedby="code-helper"
                                                />
                                                {
                                                    !errors[`promoCodesList[${index}].maxRedemptions`] &&
                                                    <FormHelperText id="name-helper">Enter Max Redemptions</FormHelperText>
                                                }
                                                <FormHelperText error={errors[`promoCodesList[${index}].maxRedemptions`] ? true : false} id="name-helper">{errors[`promoCodesList[${index}].maxRedemptions`] && <>{errors[`promoCodesList[${index}].maxRedemptions`].message}</>}</FormHelperText>

                                            </FormControl>
                                        </Form.Group>


                                        <Form.Group as={Col} md={5} controlId="minAmount">

                                            <FormControl className={classes.formControl}>
                                                <InputLabel error={errors[`promoCodesList[${index}].minAmount`] ? true : false} color="secondary" htmlFor="minAmount">Minimum Amount</InputLabel>
                                                <Input
                                                    {...register(`promoCodesList[${index}].minAmount`, {
                                                        required: "Code is required!",
                                                    })}
                                                    color="secondary"
                                                    autoComplete="none"
                                                    type="text"
                                                    error={errors[`promoCodesList[${index}].minAmount`] ? true : false}
                                                    aria-describedby="code-helper"
                                                />
                                                {
                                                    !errors[`promoCodesList[${index}].minAmount`] &&
                                                    <FormHelperText id="name-helper">Enter Minimum Amount</FormHelperText>
                                                }
                                                <FormHelperText error={errors[`promoCodesList[${index}].minAmount`] ? true : false} id="name-helper">{errors[`promoCodesList[${index}].minAmount`] && <>{errors[`promoCodesList[${index}].minAmount`].message}</>}</FormHelperText>

                                            </FormControl>
                                        </Form.Group>



                                    </Row>

                                    <Row className={classes.rowGap}>
                                        <Form.Group as={Col} md={5} controlId="firstTimeTransaction">
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`promoCodesList[${index}].firstTimeTransaction`}
                                                        control={control}
                                                        render={(props) => (
                                                            <Checkbox
                                                                checked={props.field.value}
                                                                onChange={(e) => props.field.onChange(e.target.checked)}
                                                            />
                                                        )}
                                                    />
                                                }
                                                label={"First Time Transaction"}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md={3} controlId="active">
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`promoCodesList[${index}].active`}
                                                        control={control}
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

                                    <hr />
                                </div>
                            );
                        })

                    }
                </fieldset>


            </fieldset>

            <br />
            <Button className={classes.button} onClick={_ => setPressedBtn(1)} type="submit" variant="contained" color="primary">
                Save
            </Button>
            <Button onClick={_ => setPressedBtn(2)} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </Form>);
    },
}

export default provinceObj;