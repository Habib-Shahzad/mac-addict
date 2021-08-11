import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
// import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { Link } from 'react-router-dom';
// import top100Films from './data';
import { BsBag } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import './SearchNavbar.scss';
import { ParaText1, ParaText2 } from '../../components';

function SearchNavbar(props) {
    // const {
    //     getRootProps,
    //     getInputProps,
    //     getListboxProps,
    //     getOptionProps,
    //     groupedOptions,
    // } = useAutocomplete({
    //     id: 'use-autocomplete-demo',
    //     options: top100Films,
    //     getOptionLabel: (option) => option.title,
    // });

    return (
        <Container className="custom-navbar" fluid>
            <Navbar collapseOnSelect expand="lg" bg="white" variant="white">
                <Container>
                    <div className="hamburger-icon unhide-992">
                        <GiHamburgerMenu className="ham-icon" />
                    </div>
                    <div className="img-cont">
                        <Link to="/">
                            <img src="/logo.png" alt="MAC Addict" />
                        </Link>
                    </div>
                    {/* <div className="search-box">
                        <div {...getRootProps()}>
                            <BsSearch className="search-icon" />
                            <input {...getInputProps()} />
                        </div>
                        {groupedOptions.length > 0 ? (
                            <ul className="listbox" {...getListboxProps()}>
                                {groupedOptions.map((option, index) => (
                                    <li {...getOptionProps({ option, index })}>{option.title}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div> */}
                    {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
                    {/* <Navbar.Collapse id="responsive-navbar-nav"> */}
                    <Nav className="me-auto">
                    </Nav>
                    <Nav className="icons">
                        <div className="user-name hide-992">
                            <ParaText2
                                text="Hello, Aisha Junaid"
                                classes="bold-400 margin-bottom-0"
                            />
                            <ParaText1
                                text="Points: 1028"
                                classes="bold-300 margin-bottom-0"
                            />
                        </div>
                        <div className="line hide-992" />
                        <div className="hover-box position-relative first-box hide-992">
                            <Link className="account-icon justify-content-end" to="/"><AiOutlineUser className="user-icon" /></Link>
                            {/* {
                                    user.userState ? (
                                        <div className="box-list logged-in">
                                            <Link to="/dashboard"><li>My dashboard</li></Link>
                                            <Link to={{ pathname: '/logout', state: { user: user.userState } }}><li>Logout</li></Link>
                                        </div>
                                    ) : ( */}
                            <div className="box-list">
                                <Link to="/signin"><li>Sign In</li></Link>
                                <Link to="/signup"><li>Sign Up</li></Link>
                            </div>
                            {/* )
                                } */}
                        </div>
                        <Link to="/" className="middle">
                            <IoMdHeartEmpty className="heart-icon" />
                        </Link>
                        <Link to="/">
                            <BsBag className="bag-icon" />
                        </Link>
                    </Nav>
                    {/* </Navbar.Collapse> */}
                </Container>
            </Navbar>
            <div className="margin-global-top-1" />
        </Container>
    );
}

export default SearchNavbar;