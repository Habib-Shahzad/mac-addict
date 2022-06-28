import React, { useEffect, useContext, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import './DeliveryForm.scss';
import UserContext from '../../../../contexts/user';
import CountriesContext from '../../../../contexts/country';
import { Heading1 } from '../../../../components';
import { useForm } from "react-hook-form";
import api from '../../../../api';

function DeliveryForm(props) {

    const user = useContext(UserContext).userState;
    const countries = useContext(CountriesContext);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [countryData, setCountryData] = useState({});

    useEffect(() => {
        if (Object.keys(countries.data).length > 0) {
            setCountryData(countries.data);
        }
    }, [countries])

    const availableCountries = Object.keys(countryData);
    const availableProvinces = Object.keys(countryData[selectedCountry] ?? {});
    const availableCities = (countryData[selectedCountry] ? countryData[selectedCountry][selectedProvince] : []) ?? [];

    const changeCountry = (e) => {
        setSelectedCountry(e.target.value); setSelectedProvince(''); setSelectedCity(''); reset({ 'state': '', 'city': '' })
    }

    const changeState = (e) => {
        setSelectedProvince(e.target.value); setSelectedCity(''); reset({ 'city': '' })
    }

    const changeCity = (e) => {
        setSelectedCity(e.target.value);
    }

    useEffect(() => {

    }, [user])

    const [addingAddress, setAddingAddress] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {


        const response = await fetch(`${api}/user/addAddress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                ...data,
            })
        });

        const content = await response.json();
        console.log(content);

    }

    const [addressList, setAddressList] = useState([]);

    useEffect(() => {
        const lst = [];
        const address =
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            addressLine1: "123 Main St",
            addressLine2: "",
            landmark: "Clock Tower",
            contactNumber: "03231234567",
            city: {
                name: "New York",
                active: true,
                province: {
                    name: "States",
                    active: true,
                    country: {
                        name: "United States",
                        active: true,
                    }
                }
            }
        };

        lst.push(address);
        lst.push(address);

        setAddressList(lst);

    }, [])



    return (
        <Container className="delivery-form">


            {!addingAddress &&
                <div >
                    <Row className="form-heading">
                        <Heading1
                            first="Delivery"
                            bold="Address"
                            classes="text-uppercase"
                        />
                    </Row>
                    {
                        addressList.map((address, index) => {
                            return (
                                <div className='address-element' key={index} >
                                    {index === 0 && <hr className="solid"></hr>}
                                    <div className='address-container'>
                                        <Form.Check
                                            name={'deliveryAddresses'}
                                            className='address-check'
                                            type={'radio'}
                                            id={`default-radio`}
                                        />
                                        <div className='address-info'>
                                            <div><strong>{address.firstName} {address.lastName}</strong> </div>
                                            <div>{address.addressLine1}</div>
                                            <div>{address.city.province.name}, {address.city.name}</div>
                                            <div>{address.city.province.country.name}</div>
                                            <div>{address.contactNumber}</div>
                                        </div>
                                    </div>
                                    <hr className="solid"></hr>
                                </div>
                            );
                        })
                    }

                    <button onClick={() => { setAddingAddress(true); }} className={'add-address-button'}>Add a new address</button>
                </div>
            }

            {
                addingAddress &&
                <div className='add-address-container'>

                    <Row className="form-heading">
                        <Heading1
                            first="Add"
                            bold="Address"
                            classes="text-uppercase"
                        />
                    </Row>

                    <Form onSubmit={handleSubmit(onSubmit)} className="form-style">
                        <input
                            type="password"
                            autoComplete="on"
                            value=""
                            style={{ display: 'none' }}
                            readOnly={true}
                        />

                        <Row className="justify-content-between">
                            <Form.Group as={Col} md={5} controlId="firstName-your">
                                <Form.Label>First Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register("firstName", {
                                        required: true
                                    })}
                                />
                                <div className="error-text">{errors.firstName && errors.firstName.type === "required" && <span>First Name is required</span>}</div>
                                <div className="error-text">{errors.firstName && <p>{errors.firstName.message}</p>}</div>

                            </Form.Group>
                            <Form.Group as={Col} md={5} controlId="lastName-your">
                                <Form.Label>Last Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register("lastName", {
                                        required: true
                                    })}
                                />
                                <div className="error-text">{errors.lastName && errors.lastName.type === "required" && <span>Last Name is required</span>}</div>
                                <div className="error-text">{errors.lastName && <p>{errors.lastName.message}</p>}</div>
                            </Form.Group>
                        </Row>


                        <Row className="justify-content-between">

                            <Form.Group as={Col} md={5} controlId="phoneNumber-your">
                                <Form.Label>Phone Number:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register("phoneNumber", {
                                        required: true,
                                        // 
                                        validate: (value) => {
                                            var format = /^\d{11}$/
                                            if (!value.match(format)) {
                                                return "Phone number must be 11 digits";
                                            }
                                        },

                                    })}
                                />
                                <div className="error-text">{errors.phoneNumber && errors.phoneNumber.type === "required" && <span>Phone Number is required</span>}</div>
                                <div className="error-text">{errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}</div>
                            </Form.Group>

                        </Row>

                        <Row className="justify-content-between">

                            <Form.Group as={Col} md={5} controlId="addressLine1">
                                <Form.Label>Address Line 1:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register("addressLine1", {
                                        required: true
                                    })}
                                />
                                <div className="error-text">{errors.addressLine1 && errors.addressLine1.type === "required" && <span>Address line1 is required</span>}</div>
                                <div className="error-text">{errors.addressLine1 && <p>{errors.addressLine1.message}</p>}</div>
                            </Form.Group>

                            <Form.Group as={Col} md={5} controlId="addressLine1">
                                <Form.Label>Address Line 2:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register("addressLine2", {})}
                                />
                                <div className="error-text">{errors.addressLine2 && errors.addressLine2.type === "required" && <span>Address line2 is required</span>}</div>
                                <div className="error-text">{errors.addressLine2 && <p>{errors.addressLine2.message}</p>}</div>
                            </Form.Group>
                        </Row>

                        <Row className="justify-content-between">
                            <Form.Group as={Col} md={5} controlId="addressLine1">
                                <Form.Label>Landmark:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register("landmark", {})}
                                />
                                <div className="error-text">{errors.landmark && errors.landmark.type === "required" && <span>Landmark is required</span>}</div>
                                <div className="error-text">{errors.landmark && <p>{errors.landmark.message}</p>}</div>
                            </Form.Group>
                        </Row>


                        <Row className="justify-content-between">
                            <Form.Group as={Col} md={5} controlId="country">
                                <Form.Label>Country:</Form.Label>
                                <Form.Control
                                    {...register("country", {
                                        required: true
                                    })}
                                    as='select'
                                    onChange={changeCountry}
                                    value={selectedCountry}
                                >
                                    <option disabled value={''}> </option>

                                    {availableCountries.map((country, key) => (
                                        <option value={country} key={key}>
                                            {countries.dataMappers.country[country]}
                                        </option>
                                    ))}

                                </Form.Control>

                                <div className="error-text">{errors.country && errors.country.type === "required" && <span>Country is required</span>}</div>
                                <div className="error-text">{errors.country && <p>{errors.country.message}</p>}</div>
                            </Form.Group>



                            <Form.Group as={Col} md={5} controlId="province">
                                <Form.Label>Province:</Form.Label>
                                <Form.Control
                                    {...register("province", {
                                        required: true
                                    })}
                                    as='select'
                                    onChange={changeState}
                                    value={selectedProvince}
                                >
                                    <option disabled value={''}> </option>
                                    {availableProvinces?.map((province, key) => {
                                        return (
                                            <option value={province} key={key}>
                                                {countries.dataMappers.province[province]}
                                            </option>
                                        );
                                    })}

                                </Form.Control>

                                <div className="error-text">{errors.state && errors.state.type === "required" && <span>State is required</span>}</div>
                                <div className="error-text">{errors.state && <p>{errors.state.message}</p>}</div>
                            </Form.Group>

                        </Row>

                        <Row className="justify-content-between">

                            <Form.Group as={Col} md={5} controlId="city">
                                <Form.Label>City:</Form.Label>

                                <Form.Control
                                    {...register("city", {
                                        required: true
                                    })}
                                    as='select'
                                    onChange={changeCity}
                                    value={selectedCity}
                                >
                                    <option disabled value={''}> </option>
                                    {availableCities?.map((city, key) => {
                                        return (
                                            <option value={city} key={key}>
                                                {countries.dataMappers.city[city]}
                                            </option>
                                        );
                                    })}

                                </Form.Control>

                                <div className="error-text">{errors.city && errors.city.type === "required" && <span>City is required</span>}</div>
                                <div className="error-text">{errors.city && <p>{errors.city.message}</p>}</div>
                            </Form.Group>

                        </Row>

                        <button type='submit' className={'add-address-button'}>Save address</button>
                    </Form>



                </div>
            }


        </Container>
    );
}

export default DeliveryForm;