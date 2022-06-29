import { Button, Modal } from 'react-bootstrap';
import './AddressModal.scss';
import api from '../../../api';

function AddressModal(props) {

    const deleteAddress = async () => {
        if (props.address_id) {
            const response = await fetch(`${api}/user/delete-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true,
                body: JSON.stringify({
                    address_id: props.address_id
                })
            });
            const content = await response.json();

            if (content.success) {
                props.setAddressList(content.addresses);
                props.handleClose();
            }
            else {
                props.handleClose();
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
                        < Modal.Title className="lightText">Delete Address</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="lightText" style={{ textAlign: 'center' }}>
                        <div>Are you sure you want to delete this address?</div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="my-button" variant="custom" onClick={() => { deleteAddress(); }} >
                            Yes
                        </Button>

                        <Button className="my-button" variant="custom" onClick={() => { props.handleClose(); }} >
                            <div>No</div>
                        </Button>


                    </Modal.Footer>
                </Modal>
            </div >
        </>
    );
}

export default AddressModal;