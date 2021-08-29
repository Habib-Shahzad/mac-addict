import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './DashNav.scss';

function DashNav(props) {
    const location = useLocation();
    const url = location.pathname;

    let dashboard = '';
    let orders = '';
    let wishlist = '';
    let addresses = '';

    if (url.includes('my-orders')) orders = 'active';
    else if (url.includes('my-wishlist')) wishlist = 'active';
    else if (url.includes('my-addresses')) addresses = 'active';
    else dashboard = 'active';

    return (
        <Container className="dash-nav">
            <Row className="justify-content-center">
                <div className={`link ${dashboard}`}><Link to="/dashboard">Account Information</Link></div>
                <div className={`link ${orders}`}><Link to="/dashboard/my-orders">My Orders</Link></div>
                <div className={`link ${wishlist}`}><Link to="/dashboard/my-wishlist">My Wishlist</Link></div>
                <div className={`link ${addresses}`}><Link to="/dashboard/my-addresses">My Addresses</Link></div>
            </Row>
        </Container>
    );
}

export default DashNav;