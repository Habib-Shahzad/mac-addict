import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { LinkButton, MainHeading, ProductRow } from '../../components';
import './Category.scss';

function Category(props) {
    const { category } = useParams();
    const data = [
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    ]
    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <MainHeading
                text="Make Up"
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            <ProductRow
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
            />
        </Container>
    );
}

export default Category;