import React from 'react';
// import QuickLook from '../quickLook/QuickLook';
import './SmallProductCard.scss';

function SmallProductCard(props) {
    return (
        <div className={`small-product-card ${props.classes}`}>
            <div className="img-cont">
                <img className="center-relative-horizontal" src={props.src} alt={props.name} />
                {props.quicklook}
            </div>
            <div className="product-details">
                <div className="brand-name">{props.brand}</div>
                <div className="product-name">{props.name}</div>
                <div className="product-price-points">{props.pricePoints}</div>
            </div>
                {props.button}
        </div>
    );
}

export default SmallProductCard;