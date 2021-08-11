import React from 'react';
import { Container } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import { ProductRow } from '../../components';

function AllProducts(props) {
    // const { category, productCategory, subsubcategory } = useParams();
    const data = [
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
        { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    ]
    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <ProductRow
                mainHeading="Face"
                data={data}
                button=""
            />
        </Container>
    );
}

export default AllProducts;