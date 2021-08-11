import React from 'react';
import './ParaText1.scss';

function ParaText1(props) {
    return (
        <p className={`para-text-1 ${props.classes}`}>
            {props.text}
        </p>
    );
}

export default ParaText1;