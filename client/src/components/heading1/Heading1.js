import React from 'react';
import './Heading1.scss'

function Heading1(props) {
    return (
        <div className="heading1">
            <p className={props.classes}>
                {props.first} <strong>{props.bold}</strong> <span className={props.discountClass}>{props.second}</span> <strong className="discount">{props.discountAvailable}</strong>
            </p>
            {props.newPriceHTML}
        </div>
    );
}

export default Heading1;