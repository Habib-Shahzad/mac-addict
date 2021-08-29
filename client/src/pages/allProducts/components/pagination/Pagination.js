import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Pagination.scss';

const makePaginationHref = (pages, active) => {
    const pageNumbersArray = [];
    var startIndex, endIndex;
    if (pages <= 5) {//5
        // less than 10 total pages so show all
        startIndex = 1;
        endIndex = pages;
    } else {
        if (active <= 3) {
            startIndex = 1;
            endIndex = 5;
        } else if (active + 1 >= pages) {
            startIndex = pages - 4;
            endIndex = pages;
        } else {
            startIndex = active - 3;
            endIndex = active + 1;
        }
    }

    // add first pagination if startIndex is not the 1
    if (startIndex >= 1) {
        if (active !== 1)
        pageNumbersArray.push(
            <Link className="pag-item pag-number" to={"?page=" + (active - 1)} key="0">
            <div className="arrow-left"></div>
            </Link>
        );
    }

    // Outer loop to create parent
    for (let i = startIndex; i <= endIndex; i++) {
        pageNumbersArray.push(
            <Link to={"?page=" + i} key={i} className={active === i ? "active pag-item pag-number" : "pag-item pag-number"}>
                <div>
                    {i}
                </div>
            </Link>
        );
    }

    // add last pagination if endPage is not the last pagination
    if (endIndex <= pages) {
        if (active !== pages)
        pageNumbersArray.push(
            <Link className="pag-item pag-number" to={"?page=" + (active + 1)} key={pages + 1}>
            <div className="arrow-right"></div>
            </Link>
        );
    }

    return pageNumbersArray;
};

function Pagination(props) {

    return (
        // <div className="pagination">
        //     {makePaginationHref(props.totalPages, parseInt(activePage))}
        // </div>
        <Row className="pagination">
            <Col className="paginate justify-content-center">
                {/* <div className="pag-item"><i className="fa fa-caret-left" aria-hidden="true"></i></div> */}
                {makePaginationHref(props.totalPages, parseInt(props.activePage))}
                {/* {props.paginationData} */}
                {/* <div className="active pag-item pag-number">1</div>
                <div className="pag-item pag-number">2</div>
                <div className="pag-item pag-number">3</div>
                <div className="pag-item pag-number">4</div>
                <div className="pag-item pag-number">5</div> */}
                {/* <div className="pag-item"><i className="fa fa-caret-right" aria-hidden="true"></i></div> */}
            </Col>
        </Row>
    );
}

export default Pagination;