import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { MainHeading } from '../../components';
import { Letters, BrandGroup } from './components';
import './Brands.scss';
import api from '../../api';

function Brands(props) {


    const [brandsData, setBrandsData] = useState([]);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/brand/table-data`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    withCredentials: true
                });
                const content = await response.json();

                setBrandsData(content.data);
            })();
    }, []);


    const newData = brandsData.reduce((prev, curr) => {
        let group = '';
        if ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.includes(curr.name[0])) group = curr.name[0];
        else group = '#';
        if (!prev[group]) prev[group] = { group, children: [curr] };
        else prev[group].children.push(curr);
        return prev;
    }, {});

    const result = Object.values(newData);
    const finalData = result.sort(function (a, b) {
        return a.group.toLowerCase().localeCompare(b.group.toLowerCase());
    });

    return (
        <Container fluid>
            <div className="margin-global-top-5" />
            <MainHeading
                text="Brands"
                classes="text-uppercase text-center"
            />
            <div className="margin-global-top-5" />
            <Letters
                data={finalData}
            />
            <div className="margin-global-top-10" />
            <BrandGroup
                data={finalData}
            />
        </Container>
    );
}

export default Brands;