import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import './OrderConfirmedModal.scss';
import api from '../../../../api';
import { useHistory } from 'react-router-dom';

function OrderConfirmedModal(props) {

    const history = useHistory();

    const [loading, setLoading] = React.useState(false);

    const confirmOrder = async () => {
        setLoading(true);

        const response = await fetch(`${api}/order/add-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                cost: props.cost,
                products: props.cartProducts,
                deliveryAddress: props.deliveryAddress,
                paymentMethod: props.paymentMethod,
                user_id: props.user_id,
            })
        });
        const content = await response.json();

        if (content.success) {

            const response = await fetch(`${api}/cart/clear-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true,
                body: JSON.stringify({
                    user_id: props.user_id,
                    cart_products: props.cartObj,
                })
            });
            const contentCart = await response.json();
            if (contentCart.success) {
                props.setCart(contentCart.data);
                history.push('/');
                setLoading(false);
            }
        }
    }

    return (
        <>
            <div className="d-flex flex-column align-items-center w-100  mb-3 shadow-sm">
                <Modal
                    backdrop="static"
                    keyboard={false}
                    className="custom-modal"
                    show={props.show}
                    onHide={props.handleClose}
                >
                    <Modal.Header>
                        < Modal.Title className="lightText">Order Confirmation</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="lightText" style={{ textAlign: 'center' }}>
                        <div>Are you sure you want to confirm this order? you will be redirected to the home page</div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button disabled={loading} className="my-button" variant="custom" onClick={() => { confirmOrder(); }} >
                            Yes
                        </Button>

                        <Button disabled={loading} className="my-button" variant="custom" onClick={() => { props.handleClose(); }} >
                            <div>No</div>
                        </Button>


                    </Modal.Footer>
                </Modal>
            </div >
        </>
    );
}

export default OrderConfirmedModal;