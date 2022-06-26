import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MainHeading, Heading2, Heading1, ShopButton } from '../../../../components';
import CartContext from '../../../../contexts/cart';
import api from '../../../../api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ProductList.scss';
// import DiscountContext from '../../../../contexts/discount';

function ProductList(props) {

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
        console.log(cart);
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
        console.log(cart);
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
        for (const [key, value] of Object.entries(cart.cartObj)) {
            lst.push(value);
            lst[i].key = key;
            i += 1;
        }
        setCartProducts(lst);
    }, [cart])


    useEffect(() => {
        let totalPrice = 0;
        cartProducts?.map((element) => {
            totalPrice += element.price.amount * element.quantity;
        });
        setCost(totalPrice);
    }, [cartProducts])


    return (
        <Container fluid className="product-list-back">
            <Container className="product-list">
                {
                    cartProducts?.map((element, key) => {
                        return (
                            <Row key={key} className="product-row">
                                <div className="global-mt-2 display-992" />
                                <Col lg={3}>
                                    <img src={element.images[0].imagePath} alt={element.name} />
                                </Col>
                                <div className="global-mt-3 display-992" />
                                <Col lg={5}>
                                    <Heading2
                                        bold={element.name}
                                        link="/"
                                        classes="text-uppercase"
                                    />
                                    {element.description}
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
                                            bold={`PKR.${parseInt(element.price.amount) * element.quantity}`}
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

                    <ShopButton
                        onClick={(e) => { e.preventDefault(); }}
                        classes={`text-uppercase center-relative`}
                        text={"Proceed"}
                    />

                </div>
            </Row>
        </Container>
    );
}

export default ProductList;