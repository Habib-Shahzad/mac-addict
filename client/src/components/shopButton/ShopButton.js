import React from 'react';
import { Link } from 'react-router-dom';
import './ShopButton.scss';

function ShopButton(props) {
    return (
        <Link to="" onClick={props.onClick} className={`shop-button ${props.classes}`}>
            {props.text}
        </Link>
    );
}

export default ShopButton;