import React from 'react';
import './ThirdHeading.scss';

function ThirdHeading(props) {
    return (
        <h3 className={`third-heading ${props.classes}`}>
            {props.text}
        </h3>
    );
}

export default ThirdHeading;