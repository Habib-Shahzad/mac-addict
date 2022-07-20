import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DashNav, AccountInfo, Orders, Addresses, Wishes } from './components';
import {
    Switch as RouterSwitch,
    Route,
    useHistory,
} from "react-router-dom";
import './Dashboard.scss'
import UserContext from '../contexts/user';

function Dashboard(props) {
    const user = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!user.userState) {
            history.push('/signin');
        }
    }, [user.userState, history]);

    if (!user.userState) {
        return <div></div>
    }

    return (
        <Container fluid>
            <div className="margin-global-top-5"></div>
            <DashNav />
            <div className="margin-global-top-5"></div>
            <RouterSwitch>
                <Route path="/dashboard/my-addresses" children={<Addresses />} />
                <Route path="/dashboard/my-orders" children={<Orders />} />
                <Route path="/dashboard/my-wishlist" children={<Wishes />} />
                <Route path="/dashboard" children={<AccountInfo />} />
            </RouterSwitch>
        </Container>
    );
}

export default Dashboard;