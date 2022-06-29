import React from 'react';
import { Link } from 'react-router-dom';
import './DescriptionText.scss';

function DescriptionText(props) {
    return (
        <>
            {
                props.to ?
                    <p className={`description-text ${props.classes}`}>
                        {props.text} <Link rel={props.rel} to={props.to}>{props.link}</Link>
                    </p> :
                    <p className={`description-text ${props.classes}`}>
                        {props.text}
                    </p>
            }
        </>
    );
}

export default DescriptionText;