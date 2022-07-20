import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Heading3, ParaText, Heading1 } from '../../../components';
import { Link } from 'react-router-dom';
import UserContext from '../../../contexts/user';
import { ImBin2 } from 'react-icons/im';
import api from '../../../api';
import './Wishes.scss';


function Wishes(props) {
    const user = useContext(UserContext);

    const [wishProducts, setWishProducts] = useState([]);

    useEffect(() => {
        if (user?.userState) {
            setWishProducts(user.userState.wishList);
        }
    }, [user.userState]);



    const deleteWish = async (slug) => {

        const response = await fetch(`${api}/user/remove-from-wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user.userState._id,
                slug: slug
            })
        });

        const content = await response.json();

        if (content.success) {
            user.setUserState(content.user);
        }
        else {
            console.log(content.error);
        }

        let lst = wishProducts;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].slug === slug) {
                lst.splice(i, 1);
            }
        }

        setWishProducts(lst);
    }


    return (
        <Container fluid className="product-list-back">
            {wishProducts.length > 0 ?
                (<div>
                    <Container className="product-list">
                        {
                            wishProducts.map((element, index) => {

                                return (
                                    <div className="cart-list-item" key={`${element?.key}-${index}`}>
                                        <Link to={`product/${element?.slug}`}>
                                            <Row>
                                                <Col md={3}>
                                                    <img src={element?.image} alt={element?.name} />
                                                </Col>

                                                <Col md={5}>
                                                    <div className="vertical-top-relative">
                                                        <div style={{ textIndent: '0' }}>

                                                            <Heading3
                                                                link={false}
                                                                first={element?.brand}
                                                                classes="text-uppercase font-bold font-gold"
                                                            />

                                                            <Heading3
                                                                link={false}
                                                                first={element?.name}
                                                                classes="text-uppercase font-bold"
                                                            />

                                                            <ParaText
                                                                link={false}
                                                                text={`Category: ${element?.category}`}
                                                                classes="margin-bottom-0"
                                                                href='/'
                                                            />

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col >
                                                    <div style={{ textIndent: '0', marginTop: '1rem' }} className="vertical-top-relative">
                                                        <Heading3
                                                            link={false}
                                                            bold={`PKR.${parseInt(element?.min_price)} - ${parseInt(element?.max_price)}`}
                                                            classes={`text-uppercase text-center`}
                                                        />
                                                    </div>
                                                </Col>


                                                <Col>
                                                    <ImBin2 style={{ marginTop: '1rem' }} onClick={(e) => { e.preventDefault(); deleteWish(element?.slug) }} className="delete-icon" />
                                                </Col>
                                            </Row>
                                        </Link>
                                        <hr />

                                    </div>
                                );
                            })
                        }
                    </Container>



                    <div className="margin-global-top-3" />

                    <div className="margin-global-top-3" />


                </div>) : (
                    <div style={{ textAlign: 'center' }}>
                        <Heading1
                            link={false}
                            first="Wishlist"
                            bold="is empty"
                            classes="text-uppercase"
                        />
                    </div>)
            }
        </Container>
    );
}

export default Wishes;