import React, { useContext, useState } from 'react';
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
import Sidebar from '../sidebar/Sidebar';
import UserContext from '../../contexts/user';
import api from '../../api';

function SearchNavbar(props) {
    const [open, setOpen] = useState(false);
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

    const user = useContext(UserContext);

    const handleSidebarToggle = isOpen => {
        setOpen(isOpen)
    };

    const handleClick = itemOptions => {
        /* 
            do something with the item you clicked.
            you can also send custom properties of your choice
            in the options array you'll be getting those here
            whenever you click that item
        */
    };

    const handleLogout = async event => {
        // console.log(123);
        // event.preventDefault();
        await fetch(`${api}/user/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
        });
        user.setUserState(null);
    }

    return (
        <Container className="custom-navbar" fluid>
            <Navbar collapseOnSelect expand="lg" bg="white" variant="white">
                <Container>
                    <div className="hamburger-icon unhide-992">
                        <GiHamburgerMenu onClick={() => handleSidebarToggle(true)} className="ham-icon" />
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
                            {
                                user.userState ? (
                                    <>
                                        <ParaText2
                                            text={`Hello, ${user.userState.firstName}`}
                                            classes="bold-400 margin-bottom-0"
                                        />
                                        <ParaText1
                                            text="Points: 1028"
                                            classes="bold-300 margin-bottom-0"
                                        />
                                    </>
                                ) : null
                            }
                        </div>
                        <div className="line hide-992" />
                        <div className="hover-box position-relative first-box hide-992">
                            <Link className="account-icon justify-content-end" to="/"><AiOutlineUser className="user-icon" /></Link>
                            {
                                user.userState ? (
                                    <div className="box-list logged-in">
                                        <Link to="/dashboard"><li>My dashboard</li></Link>
                                        <Link to="/" onClick={handleLogout}><li>Logout</li></Link>
                                    </div>
                                ) : (
                                    <div className="box-list">
                                        <Link to="/signin"><li>Sign In</li></Link>
                                        <Link to="/signup"><li>Sign Up</li></Link>
                                    </div>
                                )
                            }
                        </div>
                        <Link to="/" className="middle">
                            <IoMdHeartEmpty className="heart-icon" />
                        </Link>
                        <Link to="/cart">
                            <BsBag className="bag-icon" />
                        </Link>
                    </Nav>
                    {/* </Navbar.Collapse> */}
                </Container>
            </Navbar>
            <div className="unhide-992">
                <Sidebar
                    open={open}
                    handleSidebarToggle={handleSidebarToggle}
                    handleClick={handleClick}
                    options={props.options}
                    onToggle={handleSidebarToggle}
                    header={<img src="/logo.png" alt="MAC Addict" />}
                    headerClassName="side-bar-logo"
                    onItemClick={handleClick}
                />
            </div>
            <div className="margin-global-top-1" />
        </Container>
    );
}

export default SearchNavbar;