import { FormControl, Input, InputLabel, FormHelperText, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import rgbHex from "rgb-hex";
import { useForm, Controller } from "react-hook-form";


const createTableData = (data) => {
    const { _id, name, hexCode } = data;
    return { _id, name, hexCode };
}

// const editObjCheck = (data, value, editObj) => {
//     if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
//     else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
// }

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
}

const colorObj = {
    apiTable: `${api}/color/table-data`,
    deleteApi: `${api}/color/delete`,
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

        const [colorsArray, setColorsArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

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
        }, [queryID]);

        const [defaultName, setDefaultName] = useState('');
        const [defaultColor, setDefaultColor] = useState('');
        const [color, setColor] = useState(defaultColor);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultColor(editObj.hexCode);
            } else {

            }
        }, [editObj]);



        const { register, handleSubmit, formState: { errors }, control, reset } = useForm();


        const onSubmit = async (data) => {
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/color/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ name: data.name, hexCode: data.color.hex }),
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
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ _id: queryID, name: data.name, hexCode: data.color.hex }),
                });
                const content = await response.json();
                const objArray = [...colorsArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setColorsArray(objArray);
            }
            reset();
            if (pressedBtn === 1) {
                history.push('/admin/color');
            }
            else {
                setDefaultName('');
                setDefaultColor('');

                setLoading(false);
                queryID = '';
                history.push('/admin/color/add');
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
                                <FormHelperText id="name-helper">Enter name Ex. Red</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="color">

                        <FormControl style={{ marginLeft: '2rem' }} className={classes.formControl}>

                            <Controller
                                render={(props) => (
                                    <ChromePicker
                                        color={color}
                                        onChange={c => {
                                            setColor("#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a));
                                            props.field.onChange(c);
                                        }
                                        }
                                    />
                                )}
                                defaultValue={defaultColor}
                                rules={{ required: "Color is required!" }}
                                onChange={([, data]) => data}
                                name={"color"}
                                control={control}
                            />

                            <FormHelperText error={errors.color ? true : false} id="color-helper">{errors.color && <>{errors.color.message}</>}</FormHelperText>


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
        </Form>);
    },
}

export default colorObj;