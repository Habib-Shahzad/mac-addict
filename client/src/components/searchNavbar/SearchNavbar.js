
import React, { useContext, useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsBag } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import './SearchNavbar.scss';
import { ParaText1, ParaText2, ParaText, Heading2, Heading3 } from '../../components';
import Sidebar from '../sidebar/Sidebar';
import UserContext from '../../contexts/user';
import CartContext from '../../contexts/cart';
import api from '../../api';

import { Badge } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function SearchNavbar(props) {
    const [open, setOpen] = useState(false);

    const [cost, setCost] = useState(0);

    const [data, setData] = useState([]);

    const user = useContext(UserContext);
    const cart = useContext(CartContext);

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
        setData(lst);

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
        for (var i = 0; i < data.length; i++) {
            let element = data[i];
            totalPrice += element?.price * element?.quantity;
        }
        setCost(totalPrice);
    }, [data])


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
                        <div className="hover-box position-relative first-box hide-992">
                            <Link className="account-icon justify-content-end" to="/"><AiOutlineUser className="user-icon" /></Link>
                            {
                                user.userState ? (
                                    <div className="box-list logged-in">
                                        <Link to="/dashboard"><li>My dashboard</li></Link>
                                        <Link to="/" onClick={handleLogout}><li>Logout</li></Link>
                                    </div>
                                ) : (
                                    <div className="box-list">
                                        <Link to="/signin"><li>Sign In</li></Link>
                                        <Link to="/signup"><li>Sign Up</li></Link>
                                    </div>
                                )
                            }
                        </div>
                        <Link to="/" className="middle">
                            <IoMdHeartEmpty className="heart-icon" />
                        </Link>

                        {/*  */}

                        <div className="hover-box position-relative">
                            {
                                user.userState ? (
                                    <Link className="account-icon justify-content-end" to="/cart">
                                        <ThemeProvider theme={theme}>
                                            <Badge color="secondary" badgeContent={Object.keys(data).length}>
                                                <BsBag className="bag-icon" />
                                            </Badge>
                                        </ThemeProvider>
                                    </Link>) : (
                                    <Link className="account-icon justify-content-end" to="/" onClick={(e) => { e.preventDefault(); }}>
                                        <ThemeProvider theme={theme}>
                                            <Badge color="secondary" badgeContent={Object.keys(data).length}>
                                                <BsBag className="bag-icon" />
                                            </Badge>
                                        </ThemeProvider>
                                    </Link>)


                            }
                            <div className="box-list cart-box">
                                {
                                    user.userState ? (
                                        data.length === 0 ? (
                                            <div className="center-relative-fit-content">
                                                <Heading2
                                                    first="Cart is"
                                                    link="/"
                                                    bold="Empty!"
                                                    classes="text-uppercase"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="cart-list">
                                                    {
                                                        data.map((element, index) => {
                                                            return (
                                                                <li className="cart-list-item" key={`${element?.key}-${index}`}>
                                                                    <Row>
                                                                        <Col md={3}>
                                                                            <img src={element?.default_image} alt={element?.name} />
                                                                        </Col>
                                                                        <Col md={5}>
                                                                            <div className="vertical-center-relative">
                                                                                <div style={{ textIndent: '0' }}>
                                                                                    <Heading3
                                                                                        first={element?.name}
                                                                                        classes="text-uppercase"
                                                                                    />
                                                                                </div>

                                                                                <ParaText
                                                                                    text={`Quantity: ${element?.quantity}`}
                                                                                    classes="margin-bottom-0"
                                                                                    href='/'
                                                                                />

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
                                                                                    <AddIcon onClick={() => { addCartItem(element?.key) }} className="cart-icon" />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col className="align-middle">
                                                                            <div className="vertical-center-relative">
                                                                                <Heading3
                                                                                    bold={`PKR.${parseInt(element?.price) * element?.quantity}`}
                                                                                    classes={`text-uppercase text-center`}
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
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
                                    ) : (<div className="center-relative-fit-content">
                                        <Heading2
                                            linkTag="Login to"
                                            link="/signin"
                                            bold="View Cart!"
                                            classes="text-uppercase"
                                        />
                                    </div>)}
                            </div>
                        </div>

                        {/*  */}

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