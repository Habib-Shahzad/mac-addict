import React from 'react';
import {
    Link
  } from "react-router-dom";
import './QuickLook.scss';

function QuickLook(props) {
    return (
        <Link to={props.to} className="quick-look text-uppercase text-center">
            Quick Look
        </Link>
    );
}

export default QuickLook;