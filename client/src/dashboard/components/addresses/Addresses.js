import React, { Fragment, useEffect, useState } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { ImBin2 } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { MdCancel } from 'react-icons/md';
import api from '../../../api';
import { MainHeading, DescriptionText, SubHeading } from '../../../components';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import './Addresses.scss';

function Addresses(props) {
    const [addAddress, setAddress] = useState(false);
    const [edit, setEdit] = useState(false);
    const [profileChange, setProfileChange] = useState(<div></div>);
    const [saveButton, setSaveButton] = useState({ show: false, disabled: false });

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false });
    const [lastName, setlastName] = useState({ value: '', errorText: '', error: false });
    const [addressLine1, setAddressLine1] = useState({ value: '', errorText: '', error: false });
    const [addressLine2, setAddressLine2] = useState({ value: '' });
    const [area, setArea] = useState({ value: [], errorText: '', error: false });
    const [city, setCity] = useState({ value: [], errorText: '', error: false });
    const [province, setProvince] = useState({ value: [], errorText: '', error: false });
    const [country, setCountry] = useState({ value: [], errorText: '', error: false });
    const [zipcode, setZipcode] = useState({ value: '', errorText: '', error: false });

    const [countryList, setCountryList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [areaList, setAreaList] = useState([]);

    const [countryLoading, setCountryLoading] = useState(false);
    const [provinceLoading, setProvinceLoading] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);
    const [areaLoading, setAreaLoading] = useState(false);

    useEffect(() => (
        async () => {
            setSaveButton({ show: false, disabled: false });
            const response = await fetch(`${api}/country/get-countries`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store'
                },
                credentials: 'include',
                withCredentials: true,
            });
            const content = await response.json();
            setCountryList(content.data);
        }
    ), []);

    const addresses = [
        {
            firstName: 'Murtaza',
            lastName: 'Faisal Shafi',
            addressLine1: 'Addressline 1',
            addressLine2: 'Addressline 2',
            area: 'DHA Phase 1',
            city: 'Karachi',
            province: 'Sindh',
            country: 'Pakistan',
            zipcode: 75530
        }
    ];

    const handleAddAddress = _ => {
        setAddress(!addAddress);
    }

    const handleEditChange = _ => {
        setEdit(!edit);
    }

    const changeFirstName = event => {
        const { value } = event.target;
        setFirstName(prevState => ({ ...prevState, value: value }));
        if (value === '') setFirstName(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else setFirstName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName = event => {
        const { value } = event.target;
        setlastName(prevState => ({ ...prevState, value: value }));
        if (value === '') setlastName(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else setlastName(prevState => ({ ...prevState, errorText: '', error: false }));
    }

    const changeAddressLine1 = event => {
        const { value } = event.target;
        setAddressLine1(prevState => ({ ...prevState, value: value }));
        if (value === '') setAddressLine1(prevState => ({ ...prevState, errorText: 'Address line 1 is required!', error: true }));
        else setAddressLine1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeAddressLine2 = event => {
        setAddressLine2({ value: event.target.value });
    }

    const changeCountry = async array => {
        setCountry(prevState => ({ ...prevState, value: array }));
    }
    const handleCountrySearch = async (query) => {
        setCountryLoading(true);
        setCountryList([]);
        setProvinceList([]);
        setProvince(prevState => ({ ...prevState, value: [] }));
        setCityList([]);
        setCity(prevState => ({ ...prevState, value: [] }));
        setAreaList([]);
        setArea(prevState => ({ ...prevState, value: [] }));
        const response = await fetch(`${api}/country/get-countries-search?countryText=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            credentials: 'include',
            withCredentials: true,
        });
        const content = await response.json();
        setTimeout(() => {
            setCountryList(content.data);
            setCountryLoading(false);
        }, 1000)
    };
    const filterByCountry = () => true;

    const changeProvince = async array => {
        setProvince(prevState => ({ ...prevState, value: array }));
    }
    const handleProvinceSearch = async (query) => {
        setProvinceLoading(true);
        setCityList([]);
        setCity(prevState => ({ ...prevState, value: [] }));
        setAreaList([]);
        setArea(prevState => ({ ...prevState, value: [] }));
        const response = await fetch(`${api}/province/get-provinces-search?provinceText=${query}&country=${JSON.stringify(country.value)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            credentials: 'include',
            withCredentials: true,
        });
        const content = await response.json();
        setTimeout(() => {
            setProvinceList(content.data);
            setProvinceLoading(false);
        }, 1000)
    };
    const filterByProvince = () => true;

    const changeCity = async array => {
        setCity(prevState => ({ ...prevState, value: array }));
    }
    const handleCitySearch = async (query) => {
        setCityLoading(true);
        setAreaList([]);
        setArea(prevState => ({ ...prevState, value: [] }));
        const response = await fetch(`${api}/city/get-cities-search?cityText=${query}&province=${JSON.stringify(province.value)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            credentials: 'include',
            withCredentials: true,
        });
        const content = await response.json();
        setTimeout(() => {
            setCityList(content.data);
            setCityLoading(false);
        }, 1000)
    };
    const filterByCity = () => true;

    const changeArea = async array => {
        setArea(prevState => ({ ...prevState, value: array }));
    }
    const handleAreaSearch = async (query) => {
        setAreaLoading(true);
        const response = await fetch(`${api}/area/get-areas-search?areaText=${query}&city=${JSON.stringify(city.value)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            credentials: 'include',
            withCredentials: true,
        });
        const content = await response.json();
        setTimeout(() => {
            setAreaList(content.data);
            setAreaLoading(false);
        }, 1000)
    };
    const filterByArea = () => true;

    const changeZipcode = event => {
        const { value } = event.target;
        setZipcode(prevState => ({ ...prevState, value: value }));
        if (value === '') setZipcode(prevState => ({ ...prevState, errorText: 'Zipcode is required!', error: true }));
        else setZipcode(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const handleSubmit = async e => {
        e.preventDefault();
        handleEditChange();
        // const response = await fetch(`${api}/users/change-profile`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     credentials: 'include',
        //     withCredentials: true,
        //     body: JSON.stringify({
        //         firstName: firstName.value.trim(),
        //         lastName: lastName.value.trim(),
        //         contactNumber: contactNumber.value.trim(),
        //         email: email.value.trim(),
        //         password: password.value
        //     })
        // });
        // const content = await response.json();
        // if (content.data === 'success') {
        //     user.setUserState(content.user);
        //     if (content.emailChange) {
        //         setProfileChange(<Row>
        //             <div className="margin-global-top-2"></div>
        //             <DescriptionText
        //                 text="Your changes have been confirmed. Please verify your email from the link that was emailed to you."
        //                 classes="text-center"
        //             />
        //         </Row>)
        //         setTimeout(() => {
        //             setProfileChange(<div></div>)
        //         }, 3000)
        //     } else {
        setProfileChange(
            <div>
                <div className="margin-global-top-3" />
                <Row>
                    <DescriptionText
                        text="Your changes have been confirmed"
                        classes="text-center margin-bottom-0 bold"
                    />
                </Row>
            </div>)
        setTimeout(() => {
            setProfileChange(<div></div>)
        }, 1500)
        //     }
        //     setShowEditButton(true);
        //     setSaveButton({ show: false, disabled: false });
        //     setShowCancelEditButton(false);
        // } else {
        //     setProfileChange(<Row>
        //         <div className="margin-global-top-2"></div>
        //         <DescriptionText
        //             text="Invalid Password. Please try again."
        //             classes="text-center"
        //         />
        //     </Row>)
        //     setTimeout(() => {
        //         setProfileChange(<div></div>)
        //     }, 3000)
        //     setShowEditButton(true);
        //     setSaveButton({ show: false, disabled: false });
        //     setShowCancelEditButton(false);
        // }
    }

    return (
        <div>
            <MainHeading
                text="My Addresses"
                classes="text-center"
            />
            <div className="margin-global-top-2" />
            <Container className="my-addresses box-info">
                {
                    addresses.length === 0 ? (
                        <DescriptionText
                            to=""
                            text="No addresses found"
                            classes="margin-bottom-0"
                        />
                    ) : (
                        <>
                            {
                                addresses.map((value, index) => (
                                    <Row className="address-row" key={index}>
                                        <Col xs={8}>
                                            <DescriptionText
                                                to=""
                                                text={`${value.firstName} ${value.lastName}`}
                                                classes="margin-bottom-0 bold"
                                            />
                                            <DescriptionText
                                                to=""
                                                text={value.addressLine1}
                                                classes="margin-bottom-0"
                                            />
                                            <DescriptionText
                                                to=""
                                                text={value.addressLine2}
                                                classes="margin-bottom-0"
                                            />
                                            <DescriptionText
                                                to=""
                                                text={`${value.area}, ${value.city}`}
                                                classes="margin-bottom-0"
                                            />
                                            <DescriptionText
                                                to=""
                                                text={`${value.province}, ${value.country}`}
                                                classes="margin-bottom-0"
                                            />
                                            <DescriptionText
                                                to=""
                                                text={value.zipcode}
                                                classes=""
                                            />
                                        </Col>
                                        <Col>
                                            <ImBin2 className="delete-icon" />
                                        </Col>
                                    </Row>
                                ))
                            }
                        </>
                    )
                }
                {
                    addAddress ? (
                        <Row>
                            <div className="form-cont">
                                <div className="margin-global-top-2" />
                                <MdCancel onClick={handleEditChange} className="edit-icon" />
                                <SubHeading
                                    text="New Address"
                                    classes="text-center"
                                    to=""
                                />
                                <div className="margin-global-top-2" />
                                <Form className="form-style">
                                    <input
                                        type="password"
                                        autoComplete="on"
                                        value=""
                                        style={{ display: 'none' }}
                                        readOnly={true}
                                    />
                                    <Row className="justify-content-between">
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control value={firstName.value} onChange={changeFirstName} type="text" />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{firstName.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control value={lastName.value} onChange={changeLastName} type="text" />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{lastName.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Row>
                                    <div className="margin-global-top-2" />
                                    <Row className="justify-content-between">
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="addressLine1">
                                            <Form.Label>Address line 1</Form.Label>
                                            <Form.Control value={addressLine1.value} onChange={changeAddressLine1} type="text" />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{addressLine1.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="addressLine2">
                                            <Form.Label>Address line 2</Form.Label>
                                            <Form.Control value={addressLine2.value} onChange={changeAddressLine2} type="text" />
                                        </Form.Group>
                                    </Row>
                                    <div className="margin-global-top-2" />
                                    <Row className="justify-content-between">
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="country">
                                            <Form.Label>Country</Form.Label>
                                            <AsyncTypeahead
                                                filterBy={filterByCountry}
                                                isLoading={countryLoading}
                                                id="country"
                                                labelKey="name"
                                                minLength={2}
                                                onSearch={handleCountrySearch}
                                                onChange={changeCountry}
                                                options={countryList}
                                                selected={country.value}
                                                renderMenuItemChildren={(option, props) => (
                                                    <Fragment>
                                                        <span>{option.name}</span>
                                                    </Fragment>
                                                )}
                                            />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{country.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="province">
                                            <Form.Label>Province</Form.Label>
                                            <AsyncTypeahead
                                                filterBy={filterByProvince}
                                                isLoading={provinceLoading}
                                                id="province"
                                                labelKey="name"
                                                minLength={2}
                                                onSearch={handleProvinceSearch}
                                                onChange={changeProvince}
                                                options={provinceList}
                                                selected={province.value}
                                                renderMenuItemChildren={(option, props) => (
                                                    <Fragment>
                                                        <span>{option.name}</span>
                                                    </Fragment>
                                                )}
                                            />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{province.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Row>
                                    <div className="margin-global-top-2" />
                                    <Row className="justify-content-between">
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="city">
                                            <Form.Label>City</Form.Label>
                                            <AsyncTypeahead
                                                filterBy={filterByCity}
                                                isLoading={cityLoading}
                                                id="city"
                                                labelKey="name"
                                                minLength={2}
                                                onSearch={handleCitySearch}
                                                onChange={changeCity}
                                                options={cityList}
                                                selected={city.value}
                                                renderMenuItemChildren={(option, props) => (
                                                    <Fragment>
                                                        <span>{option.name}</span>
                                                    </Fragment>
                                                )}
                                            />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{city.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="area">
                                            <Form.Label>Area</Form.Label>
                                            <AsyncTypeahead
                                                filterBy={filterByArea}
                                                isLoading={areaLoading}
                                                id="area"
                                                labelKey="name"
                                                minLength={2}
                                                onSearch={handleAreaSearch}
                                                onChange={changeArea}
                                                options={areaList}
                                                selected={area.value}
                                                renderMenuItemChildren={(option, props) => (
                                                    <Fragment>
                                                        <span>{option.name}</span>
                                                    </Fragment>
                                                )}
                                            />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{area.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Row>
                                    <div className="margin-global-top-2" />
                                    <Row className="justify-content-between">
                                        <Form.Group className="input-form-group" as={Col} md={6} controlId="zipcode">
                                            <Form.Label>Zipcode</Form.Label>
                                            <Form.Control value={zipcode.value} onChange={changeZipcode} type="text" />
                                            <Row>
                                                <Col xs={8}>
                                                    <div className="error-text">{zipcode.errorText}</div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Row>
                                    {profileChange}
                                    <div className="margin-global-top-2"></div>
                                    <Row className="justify-content-center">
                                        <Button disabled={saveButton.disabled} type="submit" onClick={handleSubmit}>Save</Button>
                                    </Row>
                                </Form>
                            </div>
                        </Row>
                    ) : (
                        <Row>
                            <div onClick={handleAddAddress} className="add-address">
                                <IoMdAdd className="add-icon" />
                                <DescriptionText
                                    to=""
                                    text="Add address"
                                    classes="margin-bottom-0 width-fit"
                                />
                            </div>
                        </Row>
                    )
                }
            </Container>
        </div>
    );
}

export default Addresses;