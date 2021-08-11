import React from 'react';
import './FourthHeading.scss';

function FourthHeading(props) {
    return (
        <h4 className={`fourth-heading ${props.classes}`}>
            {props.text} <span>{props.notBold}</span>
        </h4>
    );
}

export default FourthHeading;