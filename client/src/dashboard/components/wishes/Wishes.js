import React, { useContext, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Heading3, Heading1, Heading2 } from '../../../components';
import UserContext from '../../../contexts/user';
import WishListContext from '../../../contexts/wishList';
import { ImBin2 } from 'react-icons/im';
import api from '../../../api';
import './Wishes.scss';


function Wishes(props) {
    const wish = useContext(WishListContext);
    const user = useContext(UserContext);
    const [ok, setOk] = useState(false);

    const deleteWish = async (slug, index) => {

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
            const lst = wish.wishList;
            lst.splice(index, 1);
            wish.setWishList(lst);
            setOk(!ok);
        }
        else {
            console.log(content.error);
        }
    }


    return (
        <Container fluid className="product-list-back">

            {
                wish?.wishList.length > 0 ?
                    (<div>
                        <Container className="product-list">
                            {
                                wish?.wishList?.map((element, index) => {

                                    return (
                                        <div className="cart-list-item" key={`${element?.key}-${index}`}>
                                            <Row className="product-row">
                                                <Col xs={1} md={1} style={{ justifyContent: 'center' }}>
                                                    <ImBin2
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={(e) => { e.preventDefault(); deleteWish(element?.slug, index) }}
                                                        className="delete-icon vertical-center"
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <img src={element?.image} alt={element?.name} />
                                                </Col>
                                                <Col md={3}>
                                                    <div className="vertical-top-relative">
                                                        <div style={{ textIndent: '0' }}>

                                                            <Heading2
                                                                link=""
                                                                first={element?.brand}
                                                                classes="text-uppercase font-bold font-gold"
                                                            />

                                                            <Heading2
                                                                link={`/product/${element?.slug}`}
                                                                linkTag={`${element?.name}`}
                                                                classes="margin-bottom-0 text-uppercase"
                                                            />

                                                            <Heading3
                                                                first={`Category: ${element?.category}`}
                                                                classes="margin-bottom-0"
                                                            />

                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md={4} className='priceDiv-container'>
                                                    <div className="vertical-top-relative priceDiv ">
                                                        {
                                                            element?.discountAvailable ?
                                                                <>
                                                                    <Heading2
                                                                        bold={`PKR.${parseInt(element?.min_price)} - PKR.${parseInt(element?.max_price)}`}
                                                                        classes={`text-uppercase text-center striked`}
                                                                        link=""
                                                                    />
                                                                    <Heading2
                                                                        bold={`PKR.${parseInt(element?.lowestDiscountedPrice)} - PKR.${parseInt(element?.highestDiscountedPrice)}`}
                                                                        classes={`text-uppercase text-center discount-text`}
                                                                        link=""
                                                                    />
                                                                </> :
                                                                <Heading2
                                                                    bold={`PKR.${parseInt(element?.min_price)} - PKR.${parseInt(element?.max_price)}`}
                                                                    classes={`text-uppercase text-center`}
                                                                    link=""
                                                                />
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                        </div>
                                    );
                                })
                            }
                        </Container>
                    </div>
                    )
                    :
                    (
                        <div style={{ textAlign: 'center' }}>
                            <Heading1
                                first="Cart"
                                bold="is empty"
                                classes="text-uppercase"
                            />
                        </div>
                    )
            }

        </Container>
    );
}

export default Wishes;