import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MainHeading, Heading2, Heading1, LinkButton, ParaText } from '../../../../components';
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
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
        });
        const content = await response.json();
        cart.setCart(content.data);

    }

    const addCartItem = async (key) => {
        const response = await fetch(`${api}/cart/addItem?key=${key}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
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



    useEffect(() => {
        let totalPrice = 0;
        for (var i = 0; i < cartProducts.length; i++) {
            let element = cartProducts[i];
            totalPrice += element.price * element.quantity;
        }
        setCost(totalPrice);
    }, [cartProducts])


    return (
        <Container fluid className="product-list-back">
            {cartProducts.length > 0 ?
                (<div>
                    <Container className="product-list">
                        {
                            cartProducts?.map((element, key) => {
                                return (
                                    <Row key={key} className="product-row">
                                        <div className="global-mt-2 display-992" />
                                        <Col lg={3}>
                                            <img src={element?.images[0]?.image} alt={element.name} />
                                        </Col>
                                        <div className="global-mt-3 display-992" />
                                        <Col lg={5}>
                                            <Heading2
                                                bold={element.name}
                                                link="/"
                                                classes="text-uppercase"
                                            />
                                            <ParaText
                                                text={`Color: ${element.color.name}`}
                                                classes="margin-bottom-0"
                                                href='/'
                                            />


                                            <ParaText
                                                text={`Size: ${element.size.name}`}
                                                classes="margin-bottom-0"
                                                href='/'
                                            />
                                        </Col>

                                        <Col lg={1}>
                                            <div className="center-relative">
                                                <input value={element.quantity} type="text" readOnly={true} />
                                                <div className="add-remove-icons horizontal-center-relative">
                                                    <RemoveIcon onClick={() => { removeCartItem(element.key) }} className="cart-icon" />
                                                    <AddIcon onClick={() => { addCartItem(element.key) }} className="cart-icon" />
                                                </div>
                                            </div>
                                        </Col>
                                        <div className="global-mt-3 display-992" />
                                        <Col className="align-middle">
                                            <div className="center-relative">
                                                <Heading1
                                                    bold={`PKR.${parseInt(element.price) * element.quantity}`}
                                                    classes={`text-uppercase text-center`}
                                                />
                                            </div>
                                        </Col>
                                        <div className="global-mt-2 display-992" />
                                    </Row>
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