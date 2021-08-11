import React from 'react';
import { Link } from 'react-router-dom';
import './LinkButton.scss';

function LinkButton(props) {
    return (
        <>
        {
            props.button ? (
                <Link to="" onClick={props.onClick} className={`link-button ${props.classes}`}>
                    {props.text}
                </Link>
            ) : (
                <Link to={props.to} className={`link-button ${props.classes}`}>
                    {props.text}
                </Link>
            )
        }
        </>
        // <Link to={props.to} className={`link-button ${props.classes}`}>
        //     {props.text}
        // </Link>
    );
}

export default LinkButton;