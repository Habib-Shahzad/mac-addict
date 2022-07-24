import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { LinkButton, MainHeading, ProductRow } from '../../components';

function Brand(props) {

    const [otherProducts, setOtherProducts] = useState([]);

    const { brand } = useParams();

    const [brandName, setBrandName] = useState('');


    const getProduct = (product) => {
        let prices = [];
        let discountedPrices = [];

        product.productDetails.forEach((detail) => {
            prices.push(detail.price);
            if (detail?.discountedPrice) {
                discountedPrices.push(detail.discountedPrice);
            }
        });

        const lowestPrice = Math.min(...prices);
        const highestPrice = Math.max(...prices);

        let discountAvailable = discountedPrices?.length > 0;

        const lowestDiscountedPrice = Math.min(...(discountedPrices.concat(prices)));
        const highestDiscountedPrice = Math.max(...(discountedPrices));

        if (lowestPrice === lowestDiscountedPrice && highestDiscountedPrice === highestPrice) {
            discountAvailable = false;
        }

        return {
            imagePath: product.default_image,
            name: product.name,
            brand: product.brand.name,
            price: `PKR.${lowestPrice} - PKR.${highestPrice}`,
            discountAvailable: discountAvailable,
            discountedPrice: `PKR.${lowestDiscountedPrice} - PKR.${highestDiscountedPrice}`,
            slug: product.slug
        };
    }

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/client-brand-products?brand=${brand}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                setBrandName(content.brandName);

                const productsList = [];

                content.productsList.forEach(product => {
                    productsList.push(getProduct(product));
                });

                const otherProductsList = [];

                const chunkSize = 4;
                for (let i = 0; i < productsList?.length; i += chunkSize) {
                    const chunk = productsList.slice(i, i + chunkSize);
                    otherProductsList.push(chunk);
                }

                setOtherProducts(otherProductsList);

            })();
    }, [brand]);

    const [showMore, setShowMore] = useState(false);

    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <MainHeading
                text={brandName}
                classes="text-uppercase text-center font-gold "
            />

            {otherProducts.length > 0 &&
                otherProducts.slice(0, 1).map((productList, index) => {
                    return (
                        <div key={index}>
                            <ProductRow
                                mainHeading={null}
                                data={productList}
                                button={
                                    !showMore && otherProducts.length > 1 ?
                                        <LinkButton
                                            onClick={(e) => { e.preventDefault(); setShowMore(true); }}
                                            classes="text-uppercase"
                                            text="Show more"
                                            button={true}
                                        /> : null
                                }
                                shouldHide={true}
                                lg=""
                            />
                            <div className="margin-global-top-5" />
                        </div>
                    );
                })
            }



            {
                showMore && otherProducts.length > 0 &&
                otherProducts.map((productList, index) => {
                    return (
                        <div key={index}>
                            <ProductRow
                                mainHeading={null}
                                data={productList}
                                button={
                                    (index === otherProducts.length - 1 && otherProducts.length > 1) ?
                                        <LinkButton
                                            onClick={(e) => { e.preventDefault(); setShowMore(false); }}
                                            classes="text-uppercase"
                                            text="Show less"
                                            button={true}
                                        /> : null
                                }
                                shouldHide={true}
                                lg=""
                            />
                            <div className="margin-global-top-10" />
                        </div>
                    );
                })
            }

        </Container>
    );
}

export default Brand;