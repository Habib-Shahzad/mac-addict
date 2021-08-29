import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MainHeading from '../mainHeading/MainHeading';
import QuickLook from '../quickLook/QuickLook';
import SmallProductCard from '../smallProductCard/SmallProductCard';
import './ProductRow.scss';

function ProductRow(props) {
    return (
        <Container fluid className="product-row">
            {
                props.mainHeading ? (
                    <div>
                        <Row>
                            <Col>
                                <MainHeading
                                    text={props.mainHeading}
                                    classes="text-uppercase text-center"
                                />
                            </Col>
                        </Row>
                        <div className="margin-global-top-5" />
                    </div>
                ) : null
            }
            <Row className="justify-content-center">
                {
                    props.data.map((value, index) => {
                        let newClass = '';
                        if (props.shouldHide === true && index === 2) newClass = 'hide-1200';
                        else if (props.shouldHide === true && index === 3) newClass = 'hide-768';
                        return (
                            <Col lg={props.lg} key={index} className={newClass}>
                                <SmallProductCard
                                    src={value.imagePath}
                                    name={value.name}
                                    brand={value.brand}
                                    pricePoints={value.price}
                                    classes="center-relative-horizontal"
                                    quicklook={
                                        <div className="btn-cont center-relative-horizontal">
                                            <QuickLook to={`/product/${value.slug}`} />
                                        </div>
                                    }
                                    button=""
                                />
                                <div className="margin-global-top-5" />
                            </Col>
                        )
                    })
                }
            </Row>
            {
                props.button !== '' ? (
                    <Row className="justify-content-center">
                        {props.button}
                    </Row>
                ) : null
            }
        </Container>
    );
}

export default ProductRow;