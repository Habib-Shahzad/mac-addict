import React from 'react';
import { Container } from 'react-bootstrap';
import { MainHeading } from '../../components';
import { Letters, BrandGroup } from './components';
import './Brands.scss';
import data from './data';

function Brands(props) {
    const newData = data.reduce((prev, curr) => {
        let group ='';
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

    console.log(finalData)

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