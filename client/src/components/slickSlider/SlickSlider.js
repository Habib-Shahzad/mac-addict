import React from 'react';
import { Container } from 'react-bootstrap';
import Slider from "react-slick";
import LinkButton from '../linkButton/LinkButton';
import QuickLook from '../quickLook/QuickLook';
import SmallProductCard from '../smallProductCard/SmallProductCard';
import './SlickSlider.scss';

function SlickSlider(props) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
        ]
        // nextArrow: <SampleNextArrow />,
        // prevArrow: <SamplePrevArrow />
    };
    return (
        <Container fluid className="slick-slider-style">
            <Slider {...settings}>
                {
                    props.data.map((value, index) => {
                        let prices = value.productDetails.map(({ price }) => price);
                        const lowestPrice = Math.min(...prices);
                        const highestPrice = Math.max(...prices);

                        return (
                            <div key={index}>
                                {
                                    props.type === 'price' ? (
                                        <SmallProductCard
                                            src={value.default_image}
                                            name={value.name}
                                            brand={value.brand.name}
                                            pricePoints={`PKR.${lowestPrice} - ${highestPrice}`}
                                            classes="center-relative-horizontal"
                                            quicklook={
                                                <div className="btn-cont center-relative-horizontal">
                                                    <QuickLook to={`/product/${value.slug}`} />
                                                </div>
                                            }
                                            button=""
                                        />
                                    ) : (
                                        <SmallProductCard
                                            src={value.default_image}
                                            name={value.name}
                                            brand={value.brand.name}
                                            pricePoints={value.points}
                                            classes="center-relative-horizontal"
                                            quicklook=""
                                            button={
                                                <div className="product-btn margin-global-top-1">
                                                    <LinkButton
                                                        text="Access Now"
                                                        button={false}
                                                        classes="text-uppercase center-relative-horizontal"
                                                        to="/"
                                                    />
                                                    <div className="margin-global-top-1" />
                                                </div>
                                            }
                                        />
                                    )
                                }
                            </div>
                        );
                    })
                }
            </Slider>
        </Container>
    );
}

export default SlickSlider;