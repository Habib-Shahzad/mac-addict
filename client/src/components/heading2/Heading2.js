import React from 'react';
import { Link } from 'react-router-dom';
import './Heading2.scss'

function Heading2(props) {
    return (
        <div className="heading2">
            <p className={props.classes}>
                {props.first} <strong><Link style={{ color: 'black' }} to={props.link}>{props.linkTag}</Link></strong> <strong>{props.bold}</strong> <span className={props.discountClass}>{props.second}</span> <strong className="discount">{props.discountAvailable}</strong>
            </p>
            <p className={props.classes}>
                {props.third} <strong>{props.bold3}</strong> {props.forth}
            </p>
        </div>
    );
}

export default Heading2;