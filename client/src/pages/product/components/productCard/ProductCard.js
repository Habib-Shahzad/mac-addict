
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FourthHeading, MainHeading, SubHeading, LinkButton, ShopButton, Heading3, ProductDescription } from '../../../../components';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Checkbox from '@mui/material/Checkbox';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FormControlLabel } from '@mui/material';
import CartContext from '../../../../contexts/cart';
import UserContext from '../../../../contexts/user';
import './ProductCard.scss';
import { useParams } from 'react-router-dom';
import api from '../../../../api';

function ProductCard(props) {

    const cart = useContext(CartContext);
    const user = useContext(UserContext);

    const { productSlug } = useParams();

    const [data, setData] = useState(null);
    const [activeSize, setActiveSize] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [colorList, setColorList] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [buttonText, setButtonText] = useState({ text: 'Shop it', classes1: '' });

    const lightTheme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#CF993D',
            },
            secondary: {
                main: '#c51162',
            },
            error: {
                main: '#d50000',
            },
        },
        typography: {
            fontFamily: 'Montserrat',
        },
    });


    const [productGet, setProductGet] = React.useState({});

    useEffect(() => {
        (async () => {
            const response = await fetch(`${api}/product/get-by-slug/${productSlug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store",
                },
                credentials: "include",
                withCredentials: true,

            });

            const content = await response.json();
            if (content.success) {
                setProductGet(content.data);
            }

        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [productImages, setProductImages] = useState([]);

    useEffect(() => {

        const data = {};
        if (Object.keys(productGet).length > 0) {

            if (!productGet.hasColor) {
                productGet.productDetails.forEach(obj => {
                    const sizeName = obj.size.name;
                    const priceObj = obj.price;
                    if (!data[sizeName]) data[sizeName] = { _id: obj._id, size: obj.size, images: obj.imageList, price: priceObj, points: obj.points, preOrder: obj.preOrder };
                    else data[sizeName].images.push(obj.image);
                });
            } else {
                productGet.productDetails.forEach(obj => {
                    const sizeName = obj.size.name;
                    const priceObj = obj.price;
                    const colorName = obj.color.name;
                    if (!data[sizeName]) data[sizeName] = {};
                    data[sizeName][colorName] = { _id: obj._id, size: obj.size, color: obj.color, images: obj.imageList, price: priceObj, points: obj.points, preOrder: obj.preOrder };
                });
            }
            const sizeList = Object.keys(data);
            setSizeList(sizeList);
            setActiveSize(sizeList[0]);

            let lstOfImages = [];

            if (productGet.hasColor) {
                const colorList = Object.keys(data[sizeList[0]]);
                setColorList(colorList);
                setActiveColor(colorList[0]);
                lstOfImages = (data[sizeList[0]][colorList[0]].images);
            }
            else {
                lstOfImages = (data[sizeList[0]].images);
            }

            if (lstOfImages?.length < 4) {
                lstOfImages = Array.from({ length: 4 }, (_, i) => lstOfImages[i] ?? null)
            }

            setProductImages(lstOfImages);

            setData(data);
            setProduct(productGet);
            setLoading(false);
        }
    }, [productGet, productSlug]);


    useEffect(() => {
        let lstOfImages = [];
        if (product?.hasColor) {
            lstOfImages = (data?.[activeSize]?.[activeColor]?.images);
        }
        else {
            lstOfImages = (data?.[activeSize]?.images);
        }

        if (lstOfImages?.length < 4) {
            lstOfImages = Array.from({ length: 4 }, (_, i) => lstOfImages[i] ?? null)
        }

        setProductImages(lstOfImages);

    }, [data, activeSize, activeColor, product?.hasColor]);

    const changeActiveSize = (event, size) => {
        event.preventDefault();
        if (product.hasColor) {
            const colorList = Object.keys(data[size]);
            setColorList(colorList);
            setActiveColor(colorList[0]);
        }
        setCurrentImage(0);
        setActiveSize(size);
    }
    const changeActiveColor = color => {
        setCurrentImage(0);
        setActiveColor(color);
    }

    const changeImage = num => {
        setCurrentImage(num);
    }

    const addToCart = async event => {
        event.preventDefault();
        const activeProduct = data[activeSize][activeColor];
        const response = await fetch(`${api}/cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user.userState._id,
                product_id: product._id,
                product_detail_id: activeProduct._id,
                cart_products: cart.cartObj
            })
        });

        const content = await response.json();
        cart.setCart(content.data);

        setButtonText({ text: 'Added', classes1: 'disabled-shop-button' });
        setTimeout(() => {
            setButtonText({ text: 'Shop it', classes1: '' });
        }, 1500);
    }


    const [productInWish, setProductInWish] = useState(false);


    const handleWishListChange = async (event) => {
        const checked = (event.target.checked);
        let fetch_api = checked ? `add-to-wishlist` : `remove-from-wishlist`;

        const response = await fetch(`${api}/user/${fetch_api}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user.userState._id,
                product_id: product._id,
                slug: productSlug
            })
        });

        const content = await response.json();

        if (content.success) {
            user.setUserState(content.user);
        }
        else {
            console.log(content.error);
        }

        setProductInWish(checked);
    }


    useEffect(() => {
        if (user.userState) {
            user.userState.wishList.forEach(element => {
                if (element.slug === productSlug) {
                    setProductInWish(true);
                }
            })
        }

    }, [productSlug, user])


    if (loading) return <div></div>

    return (
        <Container className="product-card">
            {data[activeSize][activeColor].preOrder &&
                <div className="ribbon"><span>Pre Order</span></div>
            }
            <Row>
                <Col lg={5}>
                    <div className="img-cont">
                        <Row>
                            <img src={productImages[currentImage].image} alt={product?.name} />
                        </Row>

                        <Row >
                            {
                                productImages?.map((imageObj, index) => {


                                    if (imageObj) {
                                        if (index === currentImage) {
                                            return (
                                                <Col key={index} >
                                                    <img className="active-image" src={imageObj.image} alt={product.name} />
                                                </Col>
                                            )
                                        }
                                        else {
                                            return (
                                                <Col key={index} onClick={() => { changeImage(index) }}>
                                                    <img className="inactive-image" src={imageObj.image} alt={product.name} />
                                                </Col>
                                            )
                                        }
                                    }
                                    else {
                                        return (
                                            <Col key={index}>
                                                <div></div>
                                            </Col>
                                        )
                                    }
                                })
                            }
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="product-details">
                        <div className="brand-name">
                            <MainHeading
                                text={product.brand.name}
                                classes="text-uppercase brand-color margin-bottom-0"
                            />
                        </div>
                        <div className="product-name">
                            <SubHeading
                                text={product.name}
                                classes="margin-bottom-0"
                            />
                        </div>
                        <div className="margin-global-top-2" />
                        <div className="product-price">
                            {
                                product.hasColor ? (
                                    <MainHeading
                                        text={`PKR.${data[activeSize][activeColor].price}`}
                                        classes="margin-bottom-0 bold"
                                    />
                                ) : (
                                    <MainHeading
                                        text={`PKR.${data[activeSize].price}`}
                                        classes="margin-bottom-0 bold"
                                    />
                                )
                            }
                        </div>

                        {/* <div className="product-points">
                            <ThirdHeading
                                text={`Points: ${data[activeSize].points}`}
                                classes="margin-bottom-0"
                            />
                        </div> */}

                        <div className="margin-global-top-2" />
                        <div className="product-description">
                            <FourthHeading
                                text="Description:"
                                classes="margin-bottom-0"
                            />
                        </div>
                        <div className="product-description">
                            <div >
                                <ProductDescription
                                    htmlText={product.product_description}
                                    classes="margin-bottom-0"
                                />
                            </div>
                        </div>
                        <div className="margin-global-top-2" />
                        <div className="product-description">
                            <FourthHeading
                                text={`Size:`}
                                notBold={activeSize}
                                classes="margin-bottom-0"
                            />
                        </div>
                        <div className="margin-global-top-1" />
                        <div className="product-sizes">
                            {
                                sizeList.map((size, index) => {
                                    // <div key={index} onClick={e => changeActiveSize(size)} className="size-text">{size}</div>
                                    return (
                                        <div key={index}>
                                            {
                                                size === activeSize ? (
                                                    <LinkButton
                                                        onClick={e => changeActiveSize(e, size)}
                                                        classes="text-uppercase active product-card-size"
                                                        text={size}
                                                        button={true}
                                                    />
                                                ) : (
                                                    <LinkButton
                                                        onClick={e => changeActiveSize(e, size)}
                                                        classes="text-uppercase product-card-size"
                                                        text={size}
                                                        button={true}
                                                    />
                                                )
                                            }
                                        </div>
                                    );
                                    // <div key={index}>
                                    //     <LinkButton
                                    //         onClick={e => changeActiveSize(size)}
                                    //         classes="text-uppercase small-width"
                                    //         text={size}
                                    //     />
                                    // </div>
                                })
                            }
                        </div>
                        {
                            product.hasColor ? (
                                <>
                                    <div className="margin-global-top-2" />
                                    <div className="product-description">
                                        <FourthHeading
                                            text="Colour:"
                                            notBold={activeColor}
                                            classes="margin-bottom-0"
                                        />
                                    </div>
                                    <div className="margin-global-top-1" />
                                    <div className="product-colors">
                                        {
                                            colorList.map((color, index) => {
                                                return (
                                                    <div key={index}>
                                                        {
                                                            color === activeColor ? (
                                                                <div onClick={e => changeActiveColor(color)} className="color-box active-color" style={{ backgroundColor: `${data[activeSize][color].color.hexCode}` }} />
                                                            ) : (
                                                                <div onClick={e => changeActiveColor(color)} className="color-box" style={{ backgroundColor: `${data[activeSize][color].color.hexCode}` }} />
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            ) : <div className="margin-global-top-8" />
                        }
                        <Row className="product-btns justify-content-end">
                            <div className="inline-block">
                                <ThemeProvider theme={lightTheme}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={handleWishListChange}
                                                checked={productInWish}
                                                icon={
                                                    <IoMdHeartEmpty
                                                        className="heart-icon"
                                                    />}
                                                checkedIcon={
                                                    <IoMdHeart
                                                        style={{ color: "#f5347f" }}
                                                        className="heart-icon"
                                                    />}
                                                name="checkedH"
                                            />}
                                    />
                                </ThemeProvider>
                            </div>

                            {
                                user.userState ?
                                    (
                                        <div className="inline-block">
                                            <ShopButton
                                                to={""}
                                                onClick={addToCart}
                                                classes={`text-uppercase center-relative ${buttonText.classes1}`}
                                                text={buttonText.text}
                                            />
                                        </div>)
                                    : (
                                        <div className="inline-block">
                                            <Heading3
                                                link={"/signin"}
                                                linkTag={'Login'}
                                                bold="to add to cart"
                                                classes="text-uppercase login-heading"
                                            />
                                        </div>)
                            }
                        </Row>
                        {/* <div className="product-name">{props.name}</div>
                        <div className="product-price-points">{props.pricePoints}</div> */}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductCard;