import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { LinkButton, MainHeading, ProductRow } from '../../components';
import './Category.scss';

function Category(props) {
    const [keys, setKeys] = useState([]);
    const [products, setProducts] = useState({});

    const { category } = useParams();
    // const data = [
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    // ];

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/client-category-products?category=${category}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
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
                                imagePath: product.imagePath,
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
    }, [category]);

    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <MainHeading
                text="Make Up"
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            {
                keys.map((value, index) => {
                    // console.log(value);
                    // console.log(products);
                    return (
                        <div key={index}>
                            <ProductRow
                                mainHeading={value}
                                data={products[value].data}
                                button={
                                    <LinkButton
                                        to={`${category}/${products[value].slug}`}
                                        classes="text-uppercase"
                                        text="Show more"
                                        button={false}
                                    />
                                }
                                shouldHide={true}
                                lg=""
                            />
                            <div className="margin-global-top-10" />
                        </div>
                    )
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

export default Category;