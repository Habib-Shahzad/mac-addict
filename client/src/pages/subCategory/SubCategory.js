import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { LinkButton, MainHeading, ProductRow } from '../../components';
import './SubCategory.scss';

function SubCategory(props) {
    const [keys, setKeys] = useState([]);
    const [products, setProducts] = useState({});

    const [otherProducts, setOtherProducts] = useState([]);

    const { category, subCategory } = useParams();


    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/client-subCategory-products?subCategory=${subCategory}`, {
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

                const keys = Object.keys(content.data);

                const obj = content.data;
                const products = {};
                keys.forEach(key => {
                    const element = obj[key];
                    // console.log(element);
                    if (element.products.length !== 0) {
                        const addProduct = {};
                        addProduct['name'] = element.name;
                        addProduct['slug'] = element.slug;
                        addProduct['data'] = [];
                        element.products.forEach(product => {
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
                            addProduct['data'].push(newProduct);
                        });
                        products[element.name] = addProduct;
                    }
                });
                setProducts(products);
                setKeys(Object.keys(products));
            })();
    }, [subCategory]);

    const [showMore, setShowMore] = useState(false);

    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <MainHeading
                text={`${subCategory.split('-')[0]}`}
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            {
                keys.map((value, index) => {
                    return (
                        <div key={index}>
                            <ProductRow
                                mainHeading={value}
                                data={products[value].data}
                                button={
                                    products[value].data.length > 3 ?
                                        <LinkButton
                                            to={`/categories/${category}/${subCategory}/${products[value].slug}`}
                                            classes="text-uppercase"
                                            text="Show more"
                                            button={false}
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
                otherProducts?.length > 0 && keys.length !== 0 &&
                <div style={{ marginBottom: '2rem' }}>
                    <MainHeading
                        text={'Other Products'}
                        classes="text-uppercase text-center"
                    />
                </div>

            }

            {otherProducts.length > 0 &&
                otherProducts.slice(0, 1).map((productList, index) => {
                    return (
                        <div key={index}>
                            <ProductRow
                                mainHeading={null}
                                data={productList}
                                button={
                                    (!showMore && otherProducts.length > 1) ?
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
                                    index === otherProducts.length - 1 && otherProducts.length > 1 ?
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

export default SubCategory;