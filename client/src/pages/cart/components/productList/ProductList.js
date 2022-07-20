import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MainHeading, Heading2, Heading1, LinkButton, Heading3 } from '../../../../components';
import CartContext from '../../../../contexts/cart';
import UserContext from '../../../../contexts/user';
import api from '../../../../api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ProductList.scss';

function ProductList(props) {

    const user = useContext(UserContext);
    const cart = useContext(CartContext);
    const [cost, setCost] = useState(0);

    const [cartProducts, setCartProducts] = useState([]);

    const removeCartItem = async (key) => {
        const response = await fetch(`${api}/cart/removeItem?key=${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,

            body: JSON.stringify({
                cart_products: cart.cartObj
            })
        });
        const content = await response.json();
        cart.setCart(content.data);
    }

    const addCartItem = async (key) => {
        const response = await fetch(`${api}/cart/addItem?key=${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,

            body: JSON.stringify({
                cart_products: cart.cartObj
            })
        });
        const content = await response.json();
        cart.setCart(content.data);
    }

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/cart/getCart`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        let lst = [];
        let i = 0;
        if (user.userState) {
            for (const [key, value] of Object.entries(cart.cartObj)) {
                if (value?.user_id === user.userState._id) {
                    lst.push(value);
                    lst[i].key = key;
                    i += 1;
                }
            }
        }
        setCartProducts(lst);

    }, [cart, user])



    useEffect(() => {
        let totalPrice = 0;
        for (var i = 0; i < cartProducts.length; i++) {
            let element = cartProducts[i];
            totalPrice += element?.price * element?.quantity;
        }
        setCost(totalPrice);
    }, [cartProducts])


    return (
        <Container fluid className="product-list-back">
            {cartProducts.length > 0 ?
                (<div>
                    <Container className="product-list">
                        {
                            cartProducts?.map((element, index) => {

                                return (
                                    <div className="cart-list-item" key={`${element?.key}-${index}`}>
                                        <Row className="product-row">
                                            <Col md={3}>
                                                <img src={element?.default_image} alt={element?.name} />
                                            </Col>
                                            <Col md={5}>
                                                <div className="vertical-top-relative">
                                                    <div style={{ textIndent: '0' }}>

                                                        <Heading2
                                                            link=""
                                                            first={element?.name}
                                                            classes="text-uppercase font-bold"
                                                        />


                                                        <Heading3
                                                            first={`Color: ${element?.color?.name}`}
                                                            classes="margin-bottom-0"
                                                        />

                                                        <Heading3
                                                            first={`Size: ${element?.size?.name}`}
                                                            classes="margin-bottom-0"
                                                        />

                                                        <div style={{ fontSize: '1.3rem' }} className="add-remove-icons">
                                                            <RemoveIcon onClick={() => { removeCartItem(element?.key) }} className="cart-icon" />
                                                            <div style={{ display: 'inline', marginLeft: '0.5rem', marginRight: '0.4rem' }}>{element?.quantity}</div>
                                                            <AddIcon onClick={() => { addCartItem(element?.key) }} className="cart-icon" />
                                                        </div>

                                                    </div>
                                                </div>
                                            </Col>

                                            <Col >
                                                <div className="vertical-top-relative" style={{ marginLeft: '4rem' }}>
                                                    <Heading2
                                                        bold={`PKR.${parseInt(element?.price) * element?.quantity}`}
                                                        classes={`text-uppercase text-center`}
                                                        link=""
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                    </div>
                                );
                            })
                        }
                    </Container>



                    <div className="margin-global-top-3" />
                    <Row>
                        <MainHeading
                            text={`Total Cost: PKR.${cost}`}
                            classes="text-uppercase text-center"
                        />
                    </Row>
                    <div className="margin-global-top-3" />
                    <Row>
                        <div className="horizontal-center-margin">


                            <LinkButton
                                onClick={() => { }}
                                classes="text-uppercase product-card-size"
                                text={"Proceed"}
                                button={false}
                                to={"/cart/delivery-info"}
                            />


                        </div>
                    </Row>

                </div>) : (
                    <div style={{ textAlign: 'center' }}>
                        <Heading1
                            first="Cart"
                            bold="is empty"
                            classes="text-uppercase"
                        />
                    </div>)
            }
        </Container>
    );
}

export default ProductList;