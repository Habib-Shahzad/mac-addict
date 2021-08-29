import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../api';
import { ProductRow } from '../../components';
import { Pagination } from './components';

function AllProducts(props) {
    const { category, subcategory, furthersubcategory } = useParams();
    const location = useLocation();
    const activePage = new URLSearchParams(location.search).get("page") || "1";
    const size = 16;
    const [mainHeading, setMainHeading] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (
          async () => {
            const response = await fetch(`${api}/product/client-all-products?category=${category}&sub-category=${subcategory}&further-sub-category=${furthersubcategory}&page=${activePage}&size=${size}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
              },
              credentials: 'include',
              withCredentials: true,
            });
            const content = await response.json();
            if (content.furtherSubCategory) setMainHeading(content.furtherSubCategory.name);
            else setMainHeading(content.subCategory.name);
            const products = [];
            content.products.forEach(product => {
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
                products.push(newProduct);
            });
            setProducts(products);
          })();
      }, [category, subcategory, furthersubcategory, activePage]);

      useEffect(() => {
          (
            async () => {
              const response = await fetch(`${api}/product/total-pages?category=${category}&sub-category=${subcategory}&further-sub-category=${furthersubcategory}&size=${size}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-store'
                },
                credentials: 'include',
                withCredentials: true,
              });
              const content = await response.json();
              setTotalPages(content.data);
            })();
        }, [category, subcategory, furthersubcategory]);

    // const data = [
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury1', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury2', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury3', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury4', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury5', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury6', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury7', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury8', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury9', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury10', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury11', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury12', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury13', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury14', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury15', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury16', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury17', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury18', price: 'PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury19', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    //     { imagePath: 'https://www.sephora.com/productimages/sku/s2432946-main-zoom.jpg', name: 'Instant Look All Over Face Palette Look of Love Collection', brand: 'Charlotte Tilbury20', price: 'PKR.2000 - PKR.3000', points: 'Points: 300', slug: 'product-slug' },
    // ];
    // const size = 4;
    // const finalData = [];
    // while (data.length > 0)
    //     finalData.push(data.splice(0, size));
    // console.log(finalData);
    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <ProductRow
                mainHeading={mainHeading}
                data={products}
                button=""
                shouldHide={false}
                lg={3}
            />
            {/* <Pagination
                paginationData={paginationData}
            /> */}
            <Pagination activePage={activePage} totalPages={totalPages} />
        </Container>
    );
}

export default AllProducts;