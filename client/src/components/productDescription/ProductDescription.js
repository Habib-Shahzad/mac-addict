import React from 'react';
import './ProductDescription.scss';
import DOMPurify from 'dompurify';


function ProductDescription(props) {

    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    return (
        <>
            <div
                className={`${props.classes}`} dangerouslySetInnerHTML={createMarkup(props.htmlText)}>
            </div>

            {/* <p className={`description-text ${props.classes}`}>
                {props.text}
            </p> */}
        </>
    );
}

export default ProductDescription;