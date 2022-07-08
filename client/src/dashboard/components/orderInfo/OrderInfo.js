import { MdCancel } from 'react-icons/md';
import { SubHeading } from '../../../components';
import { Table } from 'react-bootstrap';
import './OrderInfo.scss';

function OrderInfo(props) {


    if (!props.order) {
        return <></>
    }

    return (
        <div className="box-info">
            <div className="margin-global-top-2" />
            <MdCancel onClick={props?.handleShow} className="edit-icon" />

            <SubHeading
                text={`Order Number: ${props.order.orderNumber}`}
                classes="text-center"
                to=""
            />


            <div className="margin-global-top-2" />

            <div className="order-items-info">

                <SubHeading
                    text={`Order Items`}
                    classes=""
                    to=""
                />


                <Table size="small" aria-label="purchases">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Brand</td>
                            <td>Size</td>
                            <td>Color</td>
                            <td>Quantity</td>
                            <td>Total Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.order?.orderItems?.map((item, index) => (
                            <tr key={index}>
                                <td> {item.name} </td>

                                <td> {item.brand.name} </td>

                                <td> {item.size.name} </td>

                                <td> {item.color.name} </td>

                                <td> {item.quantity} </td>

                                <td> {item.price * item.quantity} </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>


            </div>

            <div className="margin-global-top-2" />

            <div className="order-info">

                <SubHeading
                    text={`Delivery Address`}
                    classes=""
                    to=""
                />

                <div>{props.order.deliveryAddress.addressLine1}</div>
                <div>{props.order.deliveryAddress.addressLine2}</div>
                <div>{props.order.deliveryAddress.area}</div>
                <div>{props.order.deliveryAddress.landmark ? (`near ${props.order.deliveryAddress.landmark}`) : null}</div>
                <div>{props.order.deliveryAddress.city.name}, {props.order.deliveryAddress.city.province.name}, {props.order.deliveryAddress.city.province.country.name}</div>
                <div>{props.order.deliveryAddress.zipCode}</div>

            </div>

        </div>
    );
}

export default OrderInfo;