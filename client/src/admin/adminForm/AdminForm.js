import React from 'react';
import { Divider, Typography, makeStyles } from '@material-ui/core';
import { Container, Col, Row } from 'react-bootstrap';
import { countryObj, provinceObj, cityObj, areaObj, categoryObj, subCategoryObj, furtherSubCategoryObj, brandObj, productObj, colorObj, sizeObj } from '../../db';
import { useParams } from 'react-router';
import './AdminForm.scss';

const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
        marginBottom: 10
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
        marginBottom: 15
    },
    highlight: {
        color: '#c31200'
    },
    marginTopAll: {
        marginTop: 15
    },
    delete: {
        backgroundColor: '#c31200',
        color: 'white',
        marginRight: 15,
        '&:hover': {
            background: 'black',
        },
    },
    formControl: {
        width: '100%',
    },
    rowGap: {
        marginBottom: 15
    },
    button: {
        marginRight: 15
    },
    image: {
        width: '100%',
        marginBottom: 30
    },
    divider: {
        margin: '1rem 0'
    },
}));

function AdminForm(props) {
    const { model, id } = useParams();
    const classes = useStyles();

    let formFetch = {};
    if (model === 'country') formFetch = countryObj;
    else if (model === 'province') formFetch = provinceObj;
    else if (model === 'city') formFetch = cityObj;
    else if (model === 'area') formFetch = areaObj;
    else if (model === 'category') formFetch = categoryObj;
    else if (model === 'sub-category') formFetch = subCategoryObj;
    else if (model === 'further-sub-category') formFetch = furtherSubCategoryObj;
    else if (model === 'brand') formFetch = brandObj;
    else if (model === 'product') formFetch = productObj;
    else if (model === 'color') formFetch = colorObj;
    else if (model === 'size') formFetch = sizeObj;

    return (
        <Container fluid className='adminForm'>
            <Row>
                <Col>
                    <Typography className={classes.title} variant="h3">
                        {formFetch.modelName}
                        <Divider />
                    </Typography>
                </Col>
            </Row>
            <Row>
                <Col>{formFetch.Form(id, classes)}</Col>
                {/* <Col></Col> */}
            </Row>
        </Container>
    );
}

export default AdminForm;