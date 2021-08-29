import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MainNavbar.scss';

function MainNavbar(props) {
    return (
        <div>
            <Container className="main-navbar hide-992" fluid>
                <Row className="justify-content-center">
                    {
                        props.options.map((cat, catIndex) => {
                            return (
                                <div key={catIndex} className="nav-row-fit">
                                    {
                                        cat.children === undefined ? (
                                            <Link className="main-link main-font" to={cat.to}>{cat.name}</Link>
                                        ) : (
                                            <div className="main-link hover" to="/">
                                                <Link className="main-font" to={cat.to}>{cat.name}</Link>
                                                <div className="dropdown">
                                                    <div className="dropdown-cont">
                                                        {
                                                            cat.children.map((subCat, subCatIndex) => {
                                                                return (
                                                                    <div key={subCatIndex} className="dropdown-list-cont">
                                                                        <Link className="submain-font" to={subCat.to}>{subCat.name}</Link>
                                                                        {
                                                                            subCat.children !== undefined ? (
                                                                                <div className="dropdown-list">
                                                                                    {
                                                                                        subCat.children.map((furtherSubCat, furtherSubCatIndex) => {
                                                                                            return (
                                                                                                <li key={furtherSubCatIndex}><Link className="subsubmain-font" to={furtherSubCat.to}>{furtherSubCat.name}</Link></li>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            ) : null
                                                                        }
                                                                        {/* <div className="dropdown-list">
                                                                            <li><Link className="subsubmain-font" to="/make-up/face/foundation">Foundation</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">BB & CC Creams</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Tinted Moisturizer</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Concealer</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Face Primer</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Setting Spray & Powder</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Highlighter</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Contour</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Color Correct</Link></li>
                                                                            <li><Link className="subsubmain-font" to="/">Face Sets</Link></li>
                                                                        </div> */}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {/* <div className="dropdown-list-cont">
                                                            <Link className="submain-font" to="/make-up/face">Face</Link>
                                                            <div className="dropdown-list">
                                                                <li><Link className="subsubmain-font" to="/make-up/face/foundation">Foundation</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">BB & CC Creams</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Tinted Moisturizer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Concealer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Face Primer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Setting Spray & Powder</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Highlighter</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Contour</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Color Correct</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Face Sets</Link></li>
                                                            </div>
                                                        </div>
                                                        <div className="dropdown-list-cont">
                                                            <Link className="submain-font" to="/">Eye</Link>
                                                            <div className="dropdown-list">
                                                                <li><Link className="subsubmain-font" to="/">Eye Palettes</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Mascara</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Eyeliner</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Eyebrow</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">False Eyelashes</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Eyeshadow</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Eyelash Serums</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Eye Primer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Eye Sets</Link></li>
                                                            </div>
                                                        </div>
                                                        <div className="dropdown-list-cont">
                                                            <Link className="submain-font" to="/">Lip</Link>
                                                            <div className="dropdown-list">
                                                                <li><Link className="subsubmain-font" to="/">Lipstick</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Lip Gloss</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Lip Balm & Treatment</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Liquid Lipstick</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Lip Stain</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Lip Liner</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Lip Plumper</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Lip Sets</Link></li>
                                                            </div>
                                                        </div>
                                                        <div className="dropdown-list-cont">
                                                            <Link className="submain-font" to="/">Face</Link>
                                                            <div className="dropdown-list">
                                                                <li><Link className="subsubmain-font" to="/">Foundation</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">BB & CC Creams</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Tinted Moisturizer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Concealer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Face Primer</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Setting Spray & Powder</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Highlighter</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Contour</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Color Correct</Link></li>
                                                                <li><Link className="subsubmain-font" to="/">Face Sets</Link></li>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>

                            )
                        })
                    }
                    {/* <Link className="main-link main-font" to="/brands">Brands</Link>
                    <div className="main-link hover" to="/">
                        <Link className="main-font" to="/make-up">Make Up</Link>
                        <div className="dropdown">
                            <div className="dropdown-cont">
                                <div className="dropdown-list-cont">
                                    <Link className="submain-font" to="/make-up/face">Face</Link>
                                    <div className="dropdown-list">
                                        <li><Link className="subsubmain-font" to="/make-up/face/foundation">Foundation</Link></li>
                                        <li><Link className="subsubmain-font" to="/">BB & CC Creams</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Tinted Moisturizer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Concealer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Face Primer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Setting Spray & Powder</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Highlighter</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Contour</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Color Correct</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Face Sets</Link></li>
                                    </div>
                                </div>
                                <div className="dropdown-list-cont">
                                    <Link className="submain-font" to="/">Eye</Link>
                                    <div className="dropdown-list">
                                        <li><Link className="subsubmain-font" to="/">Eye Palettes</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Mascara</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Eyeliner</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Eyebrow</Link></li>
                                        <li><Link className="subsubmain-font" to="/">False Eyelashes</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Eyeshadow</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Eyelash Serums</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Eye Primer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Eye Sets</Link></li>
                                    </div>
                                </div>
                                <div className="dropdown-list-cont">
                                    <Link className="submain-font" to="/">Lip</Link>
                                    <div className="dropdown-list">
                                        <li><Link className="subsubmain-font" to="/">Lipstick</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Lip Gloss</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Lip Balm & Treatment</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Liquid Lipstick</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Lip Stain</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Lip Liner</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Lip Plumper</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Lip Sets</Link></li>
                                    </div>
                                </div>
                                <div className="dropdown-list-cont">
                                    <Link className="submain-font" to="/">Face</Link>
                                    <div className="dropdown-list">
                                        <li><Link className="subsubmain-font" to="/">Foundation</Link></li>
                                        <li><Link className="subsubmain-font" to="/">BB & CC Creams</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Tinted Moisturizer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Concealer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Face Primer</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Setting Spray & Powder</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Highlighter</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Contour</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Color Correct</Link></li>
                                        <li><Link className="subsubmain-font" to="/">Face Sets</Link></li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link className="main-link main-font" to="/">Skin Care</Link>
                    <Link className="main-link main-font" to="/">Hair</Link>
                    <Link className="main-link main-font" to="/">Fragrance</Link>
                    <Link className="main-link main-font" to="/">Footwear</Link>
                    <Link className="main-link main-font" to="/">Bags</Link>
                    <Link className="main-link main-font" to="/">Accessorises</Link>
                    <Link className="main-link main-font" to="/">Pre-Orders</Link>
                    <Link className="main-link main-font" to="/">SALE</Link> */}
                </Row>
            </Container>
        </div>
    );
}

export default MainNavbar;