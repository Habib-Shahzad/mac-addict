
import { useState, useContext, useEffect } from 'react';
import { MdCancel } from 'react-icons/md';
import { Col, Row, Form, Button } from 'react-bootstrap';
import CountriesContext from '../../contexts/country';
import { useForm, Controller } from "react-hook-form";
import api from '../../api';
import { Typeahead } from 'react-bootstrap-typeahead';
import { SubHeading } from '..';


export default function AddAddressForm(props) {

    const countries = useContext(CountriesContext);

    const [countryData, setCountryData] = useState({});

    useEffect(() => {
        if (Object.keys(countries.data).length > 0) {
            setCountryData(countries.data);
        }
    }, [countries])


    const [typedCountry, setTypedCountry] = useState([]);
    const [typedProvince, setTypedProvince] = useState([]);
    const [typedCity, setTypedCity] = useState([]);


    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');

    const availableCountries = (countryData["countries"]) ?? [];
    const availableProvinces = (countryData[selectedCountry] ? countryData[selectedCountry]["provinces"] : []) ?? [];
    const availableCities = (countryData[selectedCountry] ? countryData[selectedCountry][selectedProvince] : []) ?? [];


    const { handleSubmit, register, control, formState: { errors }, reset, getValues } = useForm();


    const onSubmit = async (data) => {

        const response = await fetch(`${api}/user/add-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                ...data
            })
        });
        const content = await response.json();

        if (content.success) {
            props.setAddAddress(false);
            props.setAddressList(content.addresses);
        }
    }

    const [profileChange,] = useState(<div></div>);

    return (
        <div>

            <Row>
                <div className="form-cont">
                    <div className="margin-global-top-2" />
                    <MdCancel onClick={props.handleEditChange} className="edit-icon" />
                    <SubHeading
                        text="New Address"
                        classes="text-center"
                        to=""
                    />
                    <div className="margin-global-top-2" />
                    <Form onSubmit={handleSubmit(onSubmit)} className="form-style">
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
                                <Form.Control
                                    type="text"
                                    {...register("firstName", {
                                        required: true
                                    })}
                                />
                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.firstName && errors.firstName.type === "required" && <span>First Name is required</span>}</div>
                                        <div className="error-text">{errors.firstName && <p>{errors.firstName.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    {...register("lastName", {
                                        required: true
                                    })}
                                    type="text" />
                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.lastName && errors.lastName.type === "required" && <span>Last Name is required</span>}</div>
                                        <div className="error-text">{errors.lastName && <p>{errors.lastName.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>

                        <Row className="justify-content-center">
                            <Form.Group as={Col} md={6} controlId="contactNumber">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control
                                    autoComplete="off"
                                    {...register("contactNumber", {
                                        required: true,
                                        validate: (value) => {
                                            var format = /^\d{11}$/
                                            if (!value.match(format)) {
                                                return "Contact number must be 11 digits";
                                            }
                                        },

                                    })}
                                    type="text"
                                />
                                <div className="error-text">{errors.contactNumber && errors.contactNumber.type === "required" && <span>Contact Number is requried</span>}</div>
                                <div className="error-text">{errors.contactNumber && <p>{errors.contactNumber.message}</p>}</div>
                            </Form.Group>
                        </Row>

                        <div className="margin-global-top-2" />
                        <Row className="justify-content-between">
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="addressLine1">
                                <Form.Label>Address line 1</Form.Label>
                                <Form.Control
                                    {...register("addressLine1", {
                                        required: true
                                    })}
                                    type="text"
                                />
                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.addressLine1 && errors.addressLine1.type === "required" && <span>Address line1 is required</span>}</div>
                                        <div className="error-text">{errors.addressLine1 && <p>{errors.addressLine1.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="addressLine2">
                                <Form.Label>Address line 2 (Optional)</Form.Label>
                                <Form.Control
                                    {...register("addressLine2", {})}
                                    type="text" />
                            </Form.Group>
                        </Row>
                        <div className="margin-global-top-2" />
                        <Row className="justify-content-between">
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="country">
                                <Form.Label>Country</Form.Label>
                                <Controller
                                    render={({ field: { onChange } }) => (
                                        <Typeahead
                                            id="country-typeahead"
                                            labelKey="name"
                                            onChange={(data) => { setTypedCountry(data); onChange(data[0]); setSelectedCountry(data[0] ? data[0]._id : ''); setTypedProvince([]); setTypedCity([]); reset({ ...getValues(), 'province': '', 'city': '' }); }}
                                            options={availableCountries}
                                            selected={typedCountry}
                                        />
                                    )}
                                    rules={{ required: true }}
                                    control={control}
                                    name="country"
                                />

                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.country && errors.country.type === "required" && <span>Country is required</span>}</div>
                                        <div className="error-text">{errors.country && <p>{errors.country.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="province">
                                <Form.Label>Province</Form.Label>
                                <Controller
                                    render={({ field: { onChange } }) => (
                                        <Typeahead
                                            id="province-typeahead"
                                            labelKey="name"
                                            onChange={(data) => { setTypedProvince(data); onChange(data[0]); setSelectedProvince(data[0] ? data[0]._id : ''); setTypedCity([]); reset({ ...getValues(), 'city': '' }); }}
                                            options={availableProvinces}
                                            selected={typedProvince}
                                        />
                                    )}
                                    rules={{ required: true }}
                                    control={control}
                                    name="province"
                                />

                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.province && errors.province.type === "required" && <span>Province is required</span>}</div>
                                        <div className="error-text">{errors.province && <p>{errors.province.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <div className="margin-global-top-2" />
                        <Row className="justify-content-center">
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="city">
                                <Form.Label>City</Form.Label>
                                <Controller
                                    render={({ field: { onChange } }) => (
                                        <Typeahead
                                            id="city-typeahead"
                                            labelKey="name"
                                            onChange={(data) => { setTypedCity(data); onChange(data[0]); }}
                                            options={availableCities}
                                            selected={typedCity}
                                        />
                                    )}
                                    rules={{ required: true }}
                                    control={control}
                                    name="city"
                                />
                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.city && errors.city.type === "required" && <span>City is required</span>}</div>
                                        <div className="error-text">{errors.city && <p>{errors.city.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>

                        </Row>
                        <div className="margin-global-top-2" />
                        <Row className="justify-content-between">

                            <Form.Group className="input-form-group" as={Col} md={6} controlId="area">
                                <Form.Label>Area</Form.Label>
                                <Form.Control
                                    {...register("area", {
                                        required: true
                                    })}
                                    type="text" />
                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.area && errors.area.type === "required" && <span>Area is required</span>}</div>
                                        <div className="error-text">{errors.area && <p>{errors.area.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="input-form-group" as={Col} md={6} controlId="zipcode">
                                <Form.Label>Zipcode</Form.Label>
                                <Form.Control
                                    {...register("zipCode", {
                                        required: true,
                                        validate: (value) => {
                                            var reg = /^\d+$/;
                                            if (!value.match(reg)) {
                                                return "Please enter a valid zip code";
                                            }
                                        },
                                    })}
                                    type="text" />
                                <Row>
                                    <Col xs={8}>
                                        <div className="error-text">{errors.zipCode && errors.zipCode.type === "required" && <span>Zip Code is required</span>}</div>
                                        <div className="error-text">{errors.zipCode && <p>{errors.zipCode.message}</p>}</div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>

                        <Row className="justify-content-center">
                            <Form.Group className="input-form-group" as={Col} md={6} controlId="landmark">
                                <Form.Label>Landmark (Optional)</Form.Label>
                                <Form.Control
                                    {...register("landmark", {})}
                                    type="text" />
                            </Form.Group>
                        </Row>
                        {profileChange}
                        <div className="margin-global-top-2"></div>
                        <Row className="justify-content-center">
                            <Button type="submit">Save</Button>
                        </Row>
                    </Form>
                </div>
            </Row>

        </div>
    );
}