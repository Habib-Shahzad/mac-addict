import React from 'react';
import { PersonalInfo, ChangePassword } from './components';
import './AccountInfo.scss';
import { Container } from 'react-bootstrap';

function AccountInfo(props) {
    return (
        <Container fluid>
            <PersonalInfo />
            <div className="margin-global-top-5" />
            <ChangePassword />
        </Container>
    );
}

export default AccountInfo;