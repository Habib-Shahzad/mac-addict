import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import api from '../../../../api';
import { FourthHeading, MainHeading, DescriptionText, SubHeading, ThirdHeading, LinkButton, ShopButton } from '../../../../components';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FormControlLabel } from '@material-ui/core';
import './ProductCard.scss';
import { useParams } from 'react-router-dom';
import api from '../../../../api';

function ProductCard(props) {
    const [data, setData] = useState(null);
    const [activeSize, setActiveSize] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [colorList, setColorList] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [product, setProduct] = useState(null);

    const { productSlug } = useParams();

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

    useEffect(() => {
        (
            async () => {

                const response = await fetch(`${api}/product/client-product?productSlug=${productSlug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                const productGet = content.data;
                productGet.description = productGet.description.split('\n');
                // const productGet = {
                //     name: 'Instant Look All Over Face Palette Look of Love Collection',
                //     // price: 11520,
                //     // points: 350,
                //     brand: { name: "Sephora" },
                //     imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg',
                //     img1: 'https://www.sephora.com/productimages/sku/s2432946-av-04-zoom.jpg',
                //     img2: 'https://www.sephora.com/productimages/sku/s2432946-av-05-zoom.jpg',
                //     img3: 'https://www.sephora.com/productimages/sku/s2432946-av-06-zoom.jpg',
                //     description: ['Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem'],
                //     hasColor: true,
                //     productDetails: [
                //         { _id: '61044598217db513f839d483', imagePath: " https://www.sephora.com/productimages/sku/s2070571-main-zoom.jpg", preOrder: true, price: 1000, points: 100, quantity: 300, color: { _id: '6103f1fb9aa8e50aace400f8', name: 'Red', hexCode: '#FF0000' }, size: { _id: '6103f4d59aa8e50aace4012e', name: 'Small' } },
                //         { _id: '6104459821349243f839d483', imagePath: " https://www.sephora.com/productimages/sku/s2449908-main-zoom.jpg", preOrder: true, price: 1000, points: 100, quantity: 300, color: { _id: '6103f1fb9aa8e50aace400f8', name: 'Red', hexCode: '#FF0000' }, size: { _id: '6103f4d59aa8e50aace4012e', name: 'Small' } },
                //         { _id: '61044598217db513f839d483', imagePath: " https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg", preOrder: true, price: 2000, points: 300, quantity: 300, color: { _id: '6103f1fb9aa8e50aace400f8', name: 'Maroon', hexCode: '#800000' }, size: { _id: '6103f4d59aa8e50aace4012e', name: 'Small' } },
                //         { _id: '61044598217db513f839d483', imagePath: " https://www.sephora.com/productimages/sku/s2432946-av-06-zoom.jpg", preOrder: true, price: 3000, points: 400, quantity: 300, color: { _id: '6103f1fb9aa8e50aace400f8', name: 'Yellow', hexCode: '#FFFF00' }, size: { _id: '6103f4d59aa8e50aace4012e', name: 'Medium' } },
                //         { _id: '61044598217db513f839d483', imagePath: " https://www.sephora.com/productimages/sku/s2432946-av-05-zoom.jpg", preOrder: true, price: 4000, points: 500, quantity: 300, color: { _id: '6103f1fb9aa8e50aace400f8', name: 'Olive', hexCode: '#808000' }, size: { _id: '6103f4d59aa8e50aace4012e', name: 'Large' } },
                //     ],
                // }
                const data = {};
                if (!productGet.hasColor) {
                    productGet.productDetails.forEach(obj => {
                        const sizeName = obj.size.name;
                        if (!data[sizeName]) data[sizeName] = { _id: obj._id, size: obj.size, images: [obj.imagePath], price: obj.price, points: obj.points, quantity: obj.quantity, preOrder: obj.preOrder };
                        else data[sizeName].images.push(obj.imagePath);
                    });
                } else {
                    productGet.productDetails.forEach(obj => {
                        const sizeName = obj.size.name;
                        const colorName = obj.color.name;
                        if (!data[sizeName]) {
                            data[sizeName] = {};
                            if (!data[sizeName][colorName]) data[sizeName][colorName] = { _id: obj._id, size: obj.size, color: obj.color, images: [obj.imagePath], price: obj.price, points: obj.points, quantity: obj.quantity, preOrder: obj.preOrder };
                            else data[sizeName][colorName].images.push(obj.imagePath);
                        } else {
                            if (!data[sizeName][colorName]) data[sizeName][colorName] = { _id: obj._id, size: obj.size, color: obj.color, images: [obj.imagePath], price: obj.price, points: obj.points, quantity: obj.quantity, preOrder: obj.preOrder };
                            else data[sizeName][colorName].images.push(obj.imagePath);
                        }
                    });
                }
                const sizeList = Object.keys(data);
                setSizeList(sizeList);
                setActiveSize(sizeList[0]);
                if (productGet.hasColor) {
                    const colorList = Object.keys(data[sizeList[0]]);
                    setColorList(colorList);
                    setActiveColor(colorList[0]);
                }
                setData(data);
                setProduct(productGet);
            })();
    }, [productSlug]);

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
        if (product.hasColor) {
            if (data[activeSize][activeColor].images[currentImage + num]) setCurrentImage(currentImage + num);
        } else {
            if (data[activeSize].images[currentImage + num]) setCurrentImage(currentImage + num);
        }
    }
    const addToCart = event => {
        event.preventDefault();
    }

    if (!product) return <div></div>

    return (
        <Container className="product-card">
            <div className="ribbon"><span>Pre Order</span></div>
            <Row>
                <Col lg={5}>
                    <div className="img-cont">
                        <Row>
                            {
                                product.hasColor ? (
                                    <img src={data[activeSize][activeColor].images[currentImage]} alt={product.name} />
                                ) : (
                                    <img src={data[activeSize].images[currentImage]} alt={product.name} />
                                )
                            }
                            {/* <BiLeftArrow className="icon icon-left" />
                            <BiRightArrow className="icon icon-right" /> */}
                            <div onClick={e => changeImage(-1)} className="arrow-left"></div>
                            <div onClick={e => changeImage(1)} className="arrow-right"></div>
                        </Row>
                        <Row >
                            <Col>
                                {/* <img src={product.img1} alt={product.name} /> */}
                            </Col>
                            <Col>
                                {/* <img src={product.img2} alt={product.name} /> */}
                            </Col>
                            <Col>
                                {/* <img src={product.img3} alt={product.name} /> */}
                            </Col>
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
                        {
                            product.hasColor ? (
                                <div>
                                    {
                                        data[activeSize][activeColor].points !== 0 ? (
                                            <div className="product-points">
                                                <ThirdHeading
                                                    text={`Points: ${data[activeSize][activeColor].points}`}
                                                    classes="margin-bottom-0"
                                                />
                                            </div>
                                        ) : null
                                    }
                                </div>
                            ) : (
                                <div className="product-points">
                                    <ThirdHeading
                                        text={`Points: ${data[activeSize].points}`}
                                        classes="margin-bottom-0"
                                    />
                                </div>
                            )
                        }
                        <div className="margin-global-top-2" />
                        <div className="product-description">
                            <FourthHeading
                                text="Description:"
                                classes="margin-bottom-0"
                            />
                        </div>
                        <div className="product-description">
                            {
                                product.description.map((value, index) => (
                                    <div key={index}>
                                        <DescriptionText
                                            to=""
                                            text={value}
                                            classes="margin-bottom-0"
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="margin-global-top-2" />
                        <div className="product-description">
                            <FourthHeading
                                text="Size:"
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
                                        control={<Checkbox disableRipple={true} icon={<IoMdHeartEmpty className="heart-icon" />} checkedIcon={<IoMdHeart className="heart-icon" />} name="checkedH" />}
                                    />
                                </ThemeProvider>
                            </div>
                            <div className="inline-block">
                                <ShopButton
                                    onClick={addToCart}
                                    classes="text-uppercase center-relative"
                                    text="Shop it"
                                />
                            </div>
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