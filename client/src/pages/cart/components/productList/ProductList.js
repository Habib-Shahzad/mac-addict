import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DescriptionText, MainHeading, SubHeading, ThirdHeading } from '../../../../components';
import CartContext from '../../../../contexts/cart';
import api from '../../../../api';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import './ProductList.scss';
import DiscountContext from '../../../../contexts/discount';

function ProductList(props) {
    const cart = useContext(CartContext);
    const discount = useContext(DiscountContext);
    const [data, setData] = useState();
    const [discountedPrice, setDiscountedPrice] = useState({ value: '', class: '' });
    const [cost, setCost] = useState(0);
    const [discountedProducts, setDiscountedProducts] = useState([]);

    useEffect(() => {
        if (discount && discount.type === 'Product') setDiscountedProducts(discount.products);
        else setDiscountedProducts([]);
    }, [discount])

    useEffect(() => {
        try {
            if (discount && discount.type === 'Bill') {
                const cartCurrentPrice = cart.cartObj.cartTotalPrice
                if (cartCurrentPrice >= discount.minAmount && cartCurrentPrice <= discount.maxAmount) {
                    const newPrice = ((100 - discount.discountPercentage) / 100) * cartCurrentPrice;
                    setDiscountedPrice({ value: `PKR.${newPrice}`, class: 'line-through' });
                } else throw new Error();
            } else throw new Error();
        } catch (error) {
            setDiscountedPrice({ value: '', class: '' });
        }
    }, [discount, cart])

    useEffect(() => {
        try {
            let content = [];
            const removeCartItem = async (slug, type) => {
                const response = await fetch(`${api}/cart/removeItem?${type}Slug=${slug}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            }
            const addCartItem = async (slug, type) => {
                const response = await fetch(`${api}/cart/addItem?${type}Slug=${slug}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            }
            const prices = [];
            for (const key in cart.cartObj.data) {
                if (Object.hasOwnProperty.call(cart.cartObj.data, key)) {
                    const element = cart.cartObj.data[key];
                    let newPrice = element.totalPrice;
                    let newPriceHTML = <></>;
                    let lineClass = '';
                    if (element.type === 'diy' && discount && discount.type === 'DIY') {
                        newPrice = ((100 - discount.discountPercentage) / 100) * newPrice;
                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{newPrice}</strong></p>
                        lineClass = 'line-through';
                        prices.push(newPrice);
                    } else if (element.type ==='product' && discount && discount.type === 'Product') {
                        const discObj = discountedProducts.find(prod => element.item.name === prod.item.name);
                        if (discObj) {
                            const newPrice = ((100 - discObj.discountPercentage) / 100) * element.totalPrice;
                            newPriceHTML = <p style={{color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{newPrice}</strong></p>
                            lineClass = 'line-through';
                            prices.push(newPrice);
                        } else prices.push(element.totalPrice);
                    } else prices.push(element.totalPrice)
                    let paraText = <div>
                        <ThirdHeading
                            text="Description:"
                            classes="text-uppercase"
                        />
                    </div>
                    if (element.type === 'diy') {
                        paraText = (
                            <div>
                                <DescriptionText
                                    to=""
                                    text={`Size: ${element.item.size}`}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <DescriptionText
                                    to=""
                                    text={`Base: ${element.item.base}`}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <DescriptionText
                                    to=""
                                    text={`Color: ${element.item.color}`}
                                    classes="text-capatalize margin-bottom-0"
                                />
                            </div>
                        )
                    }
                    content.push(
                        <Row key={key} className="product-row">
                            <div className="margin-global-top-2 display-992" />
                            <Col lg={3}>
                                <img src={element.item.imagePath} alt={element.item.name} />
                            </Col>
                            <div className="margin-global-top-3 display-992" />
                            <Col lg={5}>
                                <SubHeading
                                    text={element.item.name}
                                    link="/"
                                    classes="text-uppercase"
                                />
                                {paraText}
                            </Col>
                            <Col lg={1}>
                                <div className="center-relative">
                                    <input value={element.count} type="text" readOnly={true} />
                                    <div className="add-remove-icons horizontal-center-relative">
                                        <RemoveIcon onClick={_ => removeCartItem(key, element.type)} className="cart-icon" />
                                        <AddIcon onClick={_ => addCartItem(key, element.type)} className="cart-icon" />
                                    </div>
                                </div>
                            </Col>
                            <div className="margin-global-top-3 display-992" />
                            <Col className="align-middle">
                                <div className="center-relative">
                                    <MainHeading
                                        text={`PKR.${element.totalPrice}`}
                                        newPriceHTML={newPriceHTML}
                                        classes={`text-uppercase text-center ${lineClass}`}
                                    />
                                </div>
                            </Col>
                            <div className="margin-global-top-2 display-992" />
                            {/* <Col lg={1}>
                                <i className="fa fa-times center-relative" aria-hidden="true"></i>
                            </Col> */}
                        </Row>
                    )
                }
            }
            setCost(prices.reduce((a, b) => a + b, 0))
            setData(content);
        } catch (error) {

        }
    }, [cart, discount, discountedProducts]);

    return (
        <Container fluid className="product-list-back">
            <Container className="product-list">
                {data}
            </Container>
            <div className="margin-global-top-3" />
            <Row>
                <MainHeading
                    text={`Total Cost: PKR.${cost}`}
                    discountAvailable={discountedPrice.value}
                    discountClass={discountedPrice.class}
                    classes="text-uppercase text-center"
                />
            </Row>
            <div className="margin-global-top-3" />
            <Row>
                <div className="horizontal-center-margin">
                    {/* <Button
                        // setArrowLeft={props.setArrowLeft}
                        // setArrowRight={props.setArrowRight}

                        // cartForm={2}
                        // setActive={props.setActive}
                        // setActiveCompClass={props.setActiveCompClass}
                        to="/cart/delivery-info"
                        text="Proceed"
                        classes="text-uppercase"
                    /> */}
                </div>
            </Row>
        </Container>
    );
}

export default ProductList;