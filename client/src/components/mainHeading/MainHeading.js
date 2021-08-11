import React from 'react';
import './MainHeading.scss';

function MainHeading(props) {
    return (
        <h1 className={`main-heading ${props.classes}`}>
            {props.text}
        </h1>
    );
}

export default MainHeading;