import React from 'react';
import { Link } from 'react-router-dom';
import './Heading3.scss'

function Heading3(props) {
    return (
        <div className="heading3">
            <p className={props.classes}>
                {props.first} {props.link ? <Link style={{ color: 'black' }} to={props.link}><strong>{props.linkTag}</strong></Link> : null} <strong>{props.bold}</strong> <span className={props.discountClass}>{props.second}</span> <strong className="discount">{props.discountAvailable}</strong>
            </p>
            {props.newPriceHTML}
        </div>
    );
}

export default Heading3;