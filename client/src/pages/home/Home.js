import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Poster, Banner } from './components';
import { MainHeading, SlickSlider } from '../../components';
import api from '../../api';
import './Home.scss';

function Home(props) {

    const [arrivals, setArrivals] = useState([]);
    const [hotsellers, setHotsellers] = useState([]);
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`${api}/product/table-data-list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true
            });
            const content = await response.json();
            if (content.success) {
                setProductsList(content.data);
            }
        })();
    }, [])

    useEffect(() => {
        if (productsList?.length > 0) {
            const newArrivalProducts = productsList.filter(product => product.newArrival);
            const hotProducts = productsList.filter(product => product.hotSeller);
            setArrivals(newArrivalProducts);
            setHotsellers(hotProducts);
        }
    }, [productsList])



    return (
        <Container fluid>
            <Poster />
            <div className="margin-global-top-5" />
            <MainHeading
                text="New Arrivals"
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            <SlickSlider type="price" data={arrivals} />

            <div className="margin-global-top-5" />
            <Row className="justify-content-center">
                <Banner
                    src="https://www.sephora.com/contentimages/homepage/072021/Homepage/DesktopMweb/2021-07-31-hp-marketing-banner-onesize-us-ca-d-slice.jpeg"
                    alt="Banner"
                    lg={5}
                />
                <Banner
                    src="https://www.sephora.com/contentimages/homepage/072021/Homepage/DesktopMweb/2021-07-22-july-clean+pp-site-desktop-home-page-marketing-banner-us-can-handoff-1280x1280.jpeg"
                    alt="Banner"
                    lg={5}
                />
            </Row>
            <div className="margin-global-top-5" />
            <MainHeading
                text="Hot Sellers"
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            <SlickSlider type="price" data={hotsellers} />
            <div className="margin-global-top-5" />
            {/* <MainHeading
                text="MAC Club Points"
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            <SlickSlider type="points" data={arrivals} /> */}
        </Container>
    );
}

export default Home;