import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { Radio, FormControlLabel, RadioGroup } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { DescriptionText, SubHeading, Heading1, LinkButton } from '../../../../components';
import { OrderConfirmedModal } from '../../components';

import './Payment.scss'
// import api from '../../../../api';
// import DiscountContext from '../../../../contexts/discount';
import CartContext from '../../../../contexts/cart';
import UserContext from '../../../../contexts/user';
import AddressContext from '../../../../contexts/address';

function Payment(props) {
    const theme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#000000',
            },
            secondary: {
                main: '#000000',
            },
        },
        typography: {
            fontFamily: 'Montserrat',
        },
    });
    const [display, setDisplay] = useState('none');
    const [radioBoxes, setRadioBoxes] = useState({ method: 'Cash on Delivery' });

    const cart = useContext(CartContext);
    const user = useContext(UserContext);
    const address = useContext(AddressContext);

    const handleChange = (event) => {
        setRadioBoxes({ method: event.target.value });
        if (event.target.value === 'Cash on Delivery') setDisplay('none');
        else setDisplay('block');
    };

    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {

        let lst = [];
        let i = 0;

        if (user.userState) {
            for (const [key, value] of Object.entries(cart.cartObj)) {
                if (value.user_id === user.userState._id) {
                    lst.push(value);
                    lst[i].key = key;
                    i += 1;
                }
            }
        }
        setCartProducts(lst);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, user])



    const [showModal, setShowModal] = useState(false);
    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = () => {
        setShowModal(true);
    }


    const [cost, setCost] = useState(0);

    useEffect(() => {
        let totalPrice = 0;
        for (var i = 0; i < cartProducts.length; i++) {
            let element = cartProducts[i];
            totalPrice += element.price * element.quantity;
        }
        setCost(totalPrice);
    }, [cartProducts])


    if (!user.userState) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Heading1
                    first="Sign"
                    bold="in"
                    classes="text-uppercase"
                />
            </div>
        )
    }

    if (!cartProducts.length === 0) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Heading1
                    first="Cart"
                    bold="is empty"
                    classes="text-uppercase"
                />
            </div>
        )
    }


    if (!address.selectedAddress) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Heading1
                    first="Address"
                    bold="not selected"
                    classes="text-uppercase"
                />
            </div>
        )
    }


    return (
        <div className='payment-back'>
            <Container className="payment">
                <OrderConfirmedModal
                    paymentMethod={radioBoxes.method}
                    deliveryAddress={address.selectedAddress}
                    cartProducts={cartProducts}
                    cost={cost}
                    show={showModal}
                    handleClose={handleClose}
                    handleShow={handleShow}
                    user_id={user.userState._id}
                    setCart={cart.setCart}
                    cartObj={cart.cartObj}
                />

                <Form className="form-style">
                    <Row>
                        <Col >
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="paymentMethod" name="paymentMethod1" value={radioBoxes.method} onChange={handleChange}>
                                    <FormControlLabel
                                        value="Cash on Delivery"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="Cash on Delivery"
                                    />
                                    <FormControlLabel
                                        value="Online Bank Transfer"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="Online Bank Transfer"
                                    />
                                </RadioGroup>
                            </ThemeProvider>
                        </Col>
                    </Row>
                    <div style={{ display: display }} className="global-mt-3"></div>
                    <Row style={{ display: display }}>
                        <Col>
                            <SubHeading
                                text="Payment details"
                                link="/"
                                classes="text-uppercase"
                            />
                            <div className="global-mt-3"></div>
                            <DescriptionText
                                to=""
                                text="Bank name"
                                classes="bold margin-bottom-0"
                            />
                            <DescriptionText
                                to=""
                                text="Account Title: Some Name"
                                classes="margin-bottom-0"
                            />
                            <DescriptionText
                                to=""
                                text="Account Number: Some number"
                                classes="margin-bottom-0"
                            />
                            <DescriptionText
                                to=""
                                text="IBAN"
                                classes=""
                            />
                            <div className="global-mt-3"></div>
                            <DescriptionText
                                to=""
                                text="Bank name"
                                classes="bold margin-bottom-0"
                            />
                            <DescriptionText
                                to=""
                                text="Account Title: Some Name"
                                classes="margin-bottom-0"
                            />
                            <DescriptionText
                                to=""
                                text="Account Number: Some number"
                                classes="margin-bottom-0"
                            />
                            <DescriptionText
                                to=""
                                text="IBAN"
                                classes=""
                            />
                            <div className="global-mt-3"></div>
                            <DescriptionText
                                text="Proof of payment with order number must be emailed at "
                                link="info@flowerworks.pk"
                                to="mailto:info@flowerworks.pk"
                                textAlign="center"
                                target="_blank"
                                rel="noreferrer"
                                classes=""
                            />
                        </Col>
                    </Row>
                </Form>
            </Container>
            <div className="global-mt-2"></div>
            <Row style={{ marginTop: '1rem' }}>
                <div className="horizontal-center-margin">
                    <LinkButton
                        classes="text-uppercase product-card-size"
                        text={"Proceed"}
                        button={true}
                        onClick={(e) => { e.preventDefault(); handleShow(); }}
                    />
                </div>
            </Row>
        </div>
    );
}

export default Payment;