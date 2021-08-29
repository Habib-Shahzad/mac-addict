import React from 'react';
import './CartCircleHeading.scss';

function CartCircleHeading(props) {
    return (
        <h1 className={`cart-circle-heading ${props.classes}`}>
            {props.text}
        </h1>
    );
}

export default CartCircleHeading;