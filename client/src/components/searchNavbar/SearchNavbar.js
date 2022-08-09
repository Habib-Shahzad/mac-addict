/* eslint-disable no-unused-vars */

import React, { useContext, useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AiOutlineHeart } from "react-icons/ai";
import { IoBagOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";

import { GiHamburgerMenu } from "react-icons/gi";
import './SearchNavbar.scss';
import { ParaText1, ParaText2, ParaText, Heading2, Heading3, LinkButton } from '../../components';
import Sidebar from '../sidebar/Sidebar';
import UserContext from '../../contexts/user';
import CartContext from '../../contexts/cart';
import WishListContext from '../../contexts/wishList';
import api from '../../api';

import { Badge } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function SearchNavbar(props) {
    const [open, setOpen] = useState(false);

    const [cost, setCost] = useState(0);

    const [cartProducts, setCartProducts] = useState([]);

    const user = useContext(UserContext);
    const cart = useContext(CartContext);
    const wish = useContext(WishListContext);

    const handleSidebarToggle = isOpen => {
        setOpen(isOpen)
    };


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

    const handleLogout = async event => {

        await fetch(`${api}/user/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
        });
        user.setUserState(null);
    }
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
            fontFamily: 'Raleway',
        },
    });


    useEffect(() => {
        let totalPrice = 0;
        for (var i = 0; i < cartProducts.length; i++) {
            let element = cartProducts[i];
            if (element?.discountedPrice) {
                totalPrice += element?.discountedPrice * element?.quantity;
            }
            else {
                totalPrice += element?.price * element?.quantity;
            }

        }
        setCost(totalPrice);
    }, [cartProducts])



    return (
        <Container className="custom-navbar" fluid>
            <Navbar collapseOnSelect expand="lg" bg="white" variant="white">
                <Container>
                    <div className="hamburger-icon unhide-992">
                        <GiHamburgerMenu onClick={() => handleSidebarToggle(true)} className="ham-icon" />
                    </div>
                    <div className="img-cont">
                        <Link to="/">
                            <img src="/logo.png" alt="MAC Addict" />
                        </Link>
                    </div>

                    <Nav className="me-auto">
                    </Nav>

                    <Nav className="icons">
                        <div className="user-name hide-992">
                            {
                                user.userState ? (
                                    <>
                                        <ParaText2
                                            text={`Hello, ${user.userState.firstName}`}
                                            classes="bold-400 margin-bottom-0"
                                        />
                                        <ParaText1
                                            text={`Points: ${user.userState.totalPoints}`}
                                            classes="bold-300 margin-bottom-0"
                                        />
                                    </>
                                ) : null
                            }
                        </div>


                        <div className="line hide-992" />

                        <div className="hover-box position-relative hide-992">
                            <Link className="account-icon justify-content-end" to={user.userState ? "/dashboard" : "/signin"} >
                                <AiOutlineUser className="user-icon" />
                            </Link>


                            {
                                user.userState ? (
                                    <div className="box-list box-list-user">
                                        <Heading2
                                            first="Welcome to"
                                            link="/"
                                            bold="MAC Addict!"
                                            classes=" text-center"
                                        />
                                        <div className="margin-global-top-2" />

                                        <div className='text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <div>
                                                <LinkButton
                                                    text="My Account"
                                                    button={false}
                                                    classes="text-uppercase center-relative-horizontal"
                                                    to="/dashboard"
                                                />
                                            </div>

                                            <div style={{ paddingLeft: '2rem' }}>
                                                <LinkButton
                                                    text="Log Out"
                                                    button={false}
                                                    classes="text-uppercase center-relative-horizontal"
                                                    onClick={handleLogout}
                                                    to="/"

                                                />
                                            </div>
                                        </div>

                                        <div className="margin-global-bottom-2" />
                                    </div>
                                ) : (
                                    <div className="box-list box-list-user">

                                        <Heading2
                                            first="Welcome to"
                                            link="/"
                                            bold="MAC Addict!"
                                            classes=" text-center"
                                        />
                                        <div className="margin-global-top-2" />

                                        <div className='text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <div>
                                                <LinkButton
                                                    text="Login"
                                                    button={false}
                                                    classes="text-uppercase center-relative-horizontal"
                                                    to="/signin"
                                                />
                                            </div>

                                            <div style={{ paddingLeft: '2rem' }}>
                                                <LinkButton
                                                    text="Sign Up"
                                                    button={false}
                                                    classes="text-uppercase center-relative-horizontal"
                                                    to="/signup"
                                                />
                                            </div>
                                        </div>

                                        <div className="margin-global-bottom-2" />
                                    </div>
                                )
                            }

                        </div>


                        <div className="hover-box position-relative">

                            <Link className="middle account-icon justify-content-end" to="/dashboard/my-wishlist">
                                <AiOutlineHeart className="heart-icon" />
                            </Link>

                            <div className="box-list box-list-wish">

                                {
                                    user.userState ? (
                                        wish.wishList.length === 0 ? (

                                            <div
                                                style={{ height: '20rem' }}
                                            >
                                                <div
                                                    className="center-relative-fit-content">
                                                    <Heading2
                                                        first="Wishlist is"
                                                        link="/"
                                                        bold="Empty!"
                                                        classes="text-uppercase"
                                                    />
                                                </div>
                                            </div>


                                        ) : (
                                            <div className="wish-box">
                                                {
                                                    wish.wishList.map((element, index) => {
                                                        return (
                                                            <li className="cart-list-item" key={`${element?.key}-${index}`}>

                                                                {/* <Link to={}> */}
                                                                <Row>

                                                                    <Col md={3}>
                                                                        <Link to={`/product/${element?.slug}`}>
                                                                            <img src={element?.image} alt={element?.name} />
                                                                        </Link>
                                                                    </Col>

                                                                    <Col md={5}>
                                                                        <div >
                                                                            <div style={{ textIndent: '0' }}>

                                                                                <ParaText
                                                                                    text={element?.brand}
                                                                                    classes="text-uppercase font-bold font-gold margin-bottom-0"
                                                                                />

                                                                                <Link to={`/product/${element?.slug}`}>

                                                                                    <ParaText
                                                                                        text={element?.name}
                                                                                        classes="text-uppercase font-bold margin-bottom-0"
                                                                                    />
                                                                                </Link>

                                                                                <ParaText
                                                                                    text={`${element?.category}`}
                                                                                    classes="margin-bottom-0"
                                                                                    href='/'
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                    </Col>

                                                                    <Col>
                                                                        <Row>
                                                                            <div style={{ textIndent: '0' }} className="">
                                                                                {
                                                                                    element?.discountAvailable ? (
                                                                                        <>
                                                                                            <ParaText
                                                                                                text={`PKR.${parseInt(element?.min_price)} - ${parseInt(element?.max_price)}`}
                                                                                                classes={`text-uppercase text-center font-bold striked margin-bottom-0`}
                                                                                            />
                                                                                            <ParaText
                                                                                                text={`PKR.${parseInt(element?.lowestDiscountedPrice)} - ${parseInt(element?.highestDiscountedPrice)}`}
                                                                                                classes={`text-uppercase text-center font-bold discount-text`}
                                                                                            />
                                                                                        </>
                                                                                    )
                                                                                        :
                                                                                        <ParaText
                                                                                            text={`PKR.${parseInt(element?.min_price)} - ${parseInt(element?.max_price)}`}
                                                                                            classes={`text-uppercase text-center font-bold`}
                                                                                        />
                                                                                }
                                                                            </div>
                                                                        </Row>
                                                                    </Col>

                                                                </Row>
                                                                {/* </Link> */}
                                                                <hr />
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </div>

                                        )
                                    ) : (
                                        <div
                                            style={{ height: '20rem' }}
                                        >
                                            <div
                                                className="center-relative-fit-content">
                                                <Heading2
                                                    linkTag="Login to"
                                                    link="/signin"
                                                    bold="View Wish List!"
                                                    classes="text-uppercase"
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>


                        <div className="hover-box position-relative">
                            {
                                user.userState ? (
                                    <Link className="account-icon justify-content-end" to="/cart">
                                        <ThemeProvider theme={theme}>
                                            <Badge
                                                color="secondary"
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        // position: 'relative',
                                                        marginTop: '10px',
                                                        fontFamily: 'Montserrat',
                                                        fontWeight: 'bold',
                                                        color: "black",
                                                        backgroundColor: "#cf993d"
                                                    }
                                                }}
                                                badgeContent={Object.keys(cartProducts).length}
                                            >
                                                <IoBagOutline className="bag-icon" />
                                            </Badge>
                                        </ThemeProvider>
                                    </Link>) : (
                                    <Link className="account-icon justify-content-end" to="/" onClick={(e) => { e.preventDefault(); }}>
                                        <ThemeProvider theme={theme}>
                                            <Badge color="secondary" badgeContent={Object.keys(cartProducts).length}>
                                                <IoBagOutline className="bag-icon" />
                                            </Badge>
                                        </ThemeProvider>
                                    </Link>)
                            }
                            <div className="box-list box-list-cart">
                                {
                                    user.userState ? (
                                        cartProducts.length === 0 ? (
                                            <div
                                                style={{ height: '20rem' }}
                                            >
                                                <div
                                                    className="center-relative-fit-content">
                                                    <Heading2
                                                        first="Cart is"
                                                        link="/"
                                                        bold="Empty!"
                                                        classes="text-uppercase"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="cart-box">
                                                <div className="cart-list">
                                                    {
                                                        cartProducts.map((element, index) => {
                                                            return (
                                                                <li className="cart-list-item" key={`${element?.key}-${index}`}>

                                                                    <Row>
                                                                        <Col md={3}>
                                                                            <img src={element?.default_image} alt={element?.name} />
                                                                        </Col>
                                                                        <Col md={5}>
                                                                            <div className="vertical-center-relative">
                                                                                <div style={{ textIndent: '0' }}>

                                                                                    <div className='font-bold'>
                                                                                        <Heading3
                                                                                            first={element?.name}
                                                                                            classes="text-uppercase"
                                                                                        />
                                                                                    </div>

                                                                                    <ParaText
                                                                                        text={`Color: ${element?.color?.name}`}
                                                                                        classes="margin-bottom-0"
                                                                                        href='/'
                                                                                    />


                                                                                    <ParaText
                                                                                        text={`Size: ${element?.size?.name}`}
                                                                                        classes="margin-bottom-0"
                                                                                        href='/'
                                                                                    />



                                                                                    <div className="add-remove-icons">
                                                                                        <RemoveIcon onClick={() => { removeCartItem(element?.key) }} className="cart-icon" />
                                                                                        <div style={{ display: 'inline', marginLeft: '0.5rem', marginRight: '0.4rem' }}>{element?.quantity}</div>
                                                                                        <AddIcon onClick={() => { addCartItem(element?.key) }} className="cart-icon" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col >
                                                                            <div className="vertical-top-relative">
                                                                                {
                                                                                    element?.discountedPrice ?
                                                                                        <>
                                                                                            <Heading3
                                                                                                bold={`PKR.${parseInt(element?.price) * element?.quantity}`}
                                                                                                classes={`text-uppercase text-center striked`}
                                                                                            />
                                                                                            <Heading3
                                                                                                bold={`PKR.${parseInt(element?.discountedPrice) * element?.quantity}`}
                                                                                                classes={`text-uppercase text-center discount-text`}
                                                                                            />
                                                                                        </>
                                                                                        :
                                                                                        <Heading3
                                                                                            bold={`PKR.${parseInt(element?.price) * element?.quantity}`}
                                                                                            classes={`text-uppercase text-center`}
                                                                                        />
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                    <hr />
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className="cart-buttons">
                                                    <Heading3
                                                        bold="Total: "
                                                        second={`PKR.${cost}`}
                                                        classes="text-uppercase"
                                                    />
                                                    <Heading3
                                                        first="Go to"
                                                        link="/cart"
                                                        linkTag="cart"
                                                        bold=""
                                                        classes="text-uppercase"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    ) : (<div
                                        style={{ height: '20rem' }}
                                    >
                                        <div
                                            className="center-relative-fit-content">
                                            <Heading2
                                                linkTag="Login to"
                                                link="/signin"
                                                bold="View Cart!"
                                                classes="text-uppercase"
                                            />
                                        </div>
                                    </div>)}
                            </div>
                        </div>


                    </Nav>
                </Container>
            </Navbar>
            <div className="unhide-992">
                <Sidebar
                    open={open}
                    handleSidebarToggle={handleSidebarToggle}
                    handleClick={() => { }}
                    options={props.options}
                    onToggle={handleSidebarToggle}
                    header={<img src="/logo.png" alt="MAC Addict" />}
                    headerClassName="side-bar-logo"
                    onItemClick={() => { }}
                />
            </div>
            <div className="margin-global-top-1" />
        </Container>
    );
}

export default SearchNavbar;