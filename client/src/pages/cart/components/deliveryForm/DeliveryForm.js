import React, { useEffect, useState, useContext } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import { ImBin2 } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import './DeliveryForm.scss';
import api from '../../../../api';
import { Heading1, DescriptionText, LinkButton, AddAddressForm } from '../../../../components';
import { AddressModal } from '../../../../dashboard/components';
import CartContext from '../../../../contexts/cart';
import UserContext from '../../../../contexts/user';
import AddressContext from '../../../../contexts/address';

function DeliveryForm(props) {

    const cart = useContext(CartContext);
    const user = useContext(UserContext);
    const addressContext = useContext(AddressContext);

    const [addAddress, setAddAddress] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [deleteableAddress, setDeleteableAddress] = useState('');

    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {

        let lst = [];
        let i = 0;

        if (user.userState) {
            for (const [key, value] of Object.entries(cart.cartObj)) {
                if (value.user_id === user.userState._id) {
                    lst.push(value);
                    lst[i].key = key;
                    i += 1;
                }
            }
        }
        setCartProducts(lst);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, user])



    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/user/address-list`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true
                });
                const content = await response.json();
                if (content.success)
                    setAddressList(content.data);
            })();

    }, [])

    const handleEditChange = _ => {
        setAddAddress(!addAddress);
    }

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = () => {
        setShowModal(true);
    }

    const [defaultAddressSelected, setDefaultAddressSelected] = useState(null);

    useEffect(() => {
        setDefaultAddressSelected(addressContext.selectedAddress);
    }, [addressContext])


    return (
        <Container className="delivery-form">
            {cartProducts.length > 0 ?
                (<div>
                    <AddressModal address_id={deleteableAddress} show={showModal} handleClose={handleClose} handleShow={handleShow} setAddressList={setAddressList} />
                    <Heading1
                        first="Delivery"
                        bold="Address"
                        classes="text-uppercase"
                    />
                    <div className="margin-global-top-2" />
                    <Container className="my-addresses box-info">
                        {
                            addressList.length === 0 ? (
                                <DescriptionText
                                    text="No addresses found"
                                    classes="margin-bottom-0"
                                />
                            ) : (
                                <>
                                    {
                                        addressList.map((address, index) => (
                                            <Row className="address-row" key={index}>
                                                <Form.Check
                                                    checked={defaultAddressSelected?._id === address?._id}
                                                    type="radio"
                                                    id="default-radio"
                                                    name="address-select"
                                                    onChange={() => addressContext.setSelectedAddress(address)}
                                                />

                                                <Col xs={8}>
                                                    <DescriptionText
                                                        to=""
                                                        text={`${address.firstName} ${address.lastName}`}
                                                        classes="margin-bottom-0 bold"
                                                    />
                                                    <DescriptionText
                                                        text={address.addressLine1}
                                                        classes="margin-bottom-0"
                                                    />
                                                    <DescriptionText
                                                        text={address.addressLine2}
                                                        classes="margin-bottom-0"
                                                    />
                                                    <DescriptionText
                                                        text={`${address.area}, ${address.city.name}`}
                                                        classes="margin-bottom-0"
                                                    />
                                                    <DescriptionText
                                                        text={`${address.city.province.name}, ${address.city.province.country.name}`}
                                                        classes="margin-bottom-0"
                                                    />
                                                    <DescriptionText
                                                        text={address.zipcode}
                                                        classes=""
                                                    />
                                                </Col>
                                                <Col>
                                                    <ImBin2 onClick={() => { handleShow(); setDeleteableAddress(address._id); }} className="delete-icon" />
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            addAddress ? (
                                <AddAddressForm
                                    addAddress={addAddress}
                                    setAddressList={setAddressList}
                                    handleEditChange={handleEditChange}
                                />) : (
                                <>
                                    <Row>
                                        <div onClick={handleEditChange} className="add-address">
                                            <IoMdAdd className="add-icon" />
                                            <DescriptionText
                                                text="Add address"
                                                classes="margin-bottom-0 width-fit"
                                            />
                                        </div>
                                    </Row>


                                    {
                                        addressContext.selectedAddress && (
                                            <Row>
                                                <div className="horizontal-center-margin">

                                                    <LinkButton
                                                        classes="text-uppercase product-card-size"
                                                        text={"Proceed"}
                                                        button={false}
                                                        to="/cart/pay-send"
                                                    />

                                                </div>
                                            </Row>
                                        )
                                    }

                                </>
                            )
                        }
                    </Container>


                </div>) : (
                    <div style={{ textAlign: 'center' }}>
                        <Heading1
                            first="Cart"
                            bold="is empty"
                            classes="text-uppercase"
                        />
                    </div>
                )
            }
        </Container>
    );
}

export default DeliveryForm;