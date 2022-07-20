import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { MainHeading, ProductRow } from '../../components';
import './FurtherSubCategory.scss';

function SubCategory(props) {

    const [otherProducts, setOtherProducts] = useState([]);

    const { furtherSubCategory } = useParams();

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/client-furtherSubCategory-products?furtherSubCategory=${furtherSubCategory}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();

                const productsList = [];

                content.productsList.forEach(product => {
                    let prices = product.productDetails.map(({ price }) => price);
                    const lowestPrice = Math.min(...prices);
                    const highestPrice = Math.max(...prices);
                    let price = '';
                    if (lowestPrice === highestPrice) price = `PKR.${lowestPrice}`;
                    else price = `PKR.${lowestPrice} - PKR.${highestPrice}`;
                    const newProduct = {
                        imagePath: product.default_image,
                        name: product.name,
                        brand: product.brand.name,
                        price: price,
                        slug: product.slug
                    };
                    productsList.push(newProduct);
                });

                const otherProductsList = [];

                const chunkSize = 4;
                for (let i = 0; i < productsList?.length; i += chunkSize) {
                    const chunk = productsList.slice(i, i + chunkSize);
                    otherProductsList.push(chunk);
                }

                setOtherProducts(otherProductsList);

            })();
    }, [furtherSubCategory]);

    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <MainHeading
                text={`${furtherSubCategory.split('-')[0]}`}
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />


            {
                otherProducts?.length > 0 &&
                otherProducts.map((productList, index) => {
                    return (
                        <div key={index}>
                            <ProductRow
                                mainHeading={null}
                                data={productList}
                                button={null}
                                shouldHide={true}
                                lg=""
                            />
                            <div className="margin-global-top-10" />
                        </div>
                    );
                })

            }


            {/* <ProductRow
                mainHeading="Face"
                data={data}
                button={
                    <LinkButton
                        to={`${category}/face`}
                        classes="text-uppercase"
                        text="Show more"
                        button={false}
                    />
                }
                shouldHide={true}
                lg=""
            />
            <div className="margin-global-top-10" />
            <ProductRow
                mainHeading="Lips"
                data={data}
                button={
                    <LinkButton
                        to={`${category}/lips`}
                        classes="text-uppercase"
                        text="Show more"
                        button={false}
                    />
                }
                shouldHide={true}
                lg=""
            />
            <div className="margin-global-top-10" />
            <ProductRow
                mainHeading="Eyes"
                data={data}
                button={
                    <LinkButton
                        to={`${category}/eyes`}
                        classes="text-uppercase"
                        text="Show more"
                        button={false}
                    />
                }
                shouldHide={true}
                lg=""
            /> */}
        </Container>
    );
}

export default SubCategory;