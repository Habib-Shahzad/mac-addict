import React from 'react';
import { Container } from 'react-bootstrap';
import { ProductRow } from '../../components';
import { ProductCard } from './components';
import './Product.scss';

function Product(props) {
    const similar = [
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    ]
    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <ProductCard />
            <div className="margin-global-top-5" />
            <ProductRow
                mainHeading="Similar Products"
                data={similar}
                button=""
                shouldHide={true}
            />
        </Container>
    );
}

export default Product;