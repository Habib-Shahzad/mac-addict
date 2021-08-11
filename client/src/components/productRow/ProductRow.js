import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MainHeading from '../mainHeading/MainHeading';
import QuickLook from '../quickLook/QuickLook';
import SmallProductCard from '../smallProductCard/SmallProductCard';
import './ProductRow.scss';

function ProductRow(props) {
    return (
        <Container fluid className="product-row">
            <Row>
                <Col>
                    <MainHeading
                        text={props.mainHeading}
                        classes="text-uppercase text-center"
                    />
                </Col>
            </Row>
            <div className="margin-global-top-5" />
            <Row className="justify-content-center">
                {
                    props.data.map((value, index) => (
                        <Col lg={3} key={index}>
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
                        </Col>
                    ))
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