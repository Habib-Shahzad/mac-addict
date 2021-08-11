import React from 'react';
import './DescriptionText.scss';

function DescriptionText(props) {
    return (
        <p className={`description-text ${props.classes}`}>
            {props.text}
        </p>
    );
}

export default DescriptionText;