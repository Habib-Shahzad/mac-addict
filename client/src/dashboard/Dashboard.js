import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { DashNav, AccountInfo, Orders, Addresses } from './components';
import {
    // BrowserRouter as Router,
    Switch as RouterSwitch,
    Route,
    useHistory,
} from "react-router-dom";
import './Dashboard.scss'
import UserContext from '../contexts/user';
import api from '../api';

function Dashboard(props) {
    const [dbUser, setDbUser] = useState(null);
    const user = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
      (
        async () => {
          if (user.userState) {
              const response = await fetch(`${api}/user/get-personal-info`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                  withCredentials: true,
              });
              const content = await response.json();
              setDbUser(content.data);
          }
        })();
    }, [user.userState]);

    useEffect(() => {
        if (!user.userState) {
            history.push('/');
        }
    }, [user.userState, history]);

    return (
        <Container fluid>
            <div className="margin-global-top-5"></div>
            <DashNav />
            <div className="margin-global-top-5"></div>
            <RouterSwitch>
                <Route path="/dashboard/my-addresses" children={<Addresses />} />
                <Route path="/dashboard/my-orders" children={<Orders />} />
                <Route path="/dashboard" children={<AccountInfo dbUser={dbUser} />} />
            </RouterSwitch>
        </Container>
    );
}

export default Dashboard;