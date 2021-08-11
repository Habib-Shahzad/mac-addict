import React from 'react';
import './SubHeading.scss'

function SubHeading(props) {
    return (
        <h2 className={`sub-heading ${props.classes}`}>
            {props.text}
        </h2>
    );
}

export default SubHeading;