import React from 'react';
import './ParaText2.scss';

function ParaText2(props) {
    return (
        <p className={`para-text-2 ${props.classes}`}>
            {props.text}
        </p>
    );
}

export default ParaText2;