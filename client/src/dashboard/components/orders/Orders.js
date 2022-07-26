import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Row } from 'react-bootstrap';
import { MainHeading } from '../../../components';
import { Link } from 'react-router-dom';
import UserContext from '../../../contexts/user';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import api from '../../../api';
import OrderInfo from '../orderInfo/OrderInfo';
import './Orders.scss';


function Orders(props) {
    const user = useContext(UserContext);

    const [orders, setOrders] = useState([]);
    const [showOrderInfo, setShowOrderInfo] = useState(false);
    const [orderToShow, setOrderToShow] = useState(null);

    useEffect(() => {
        (async () => {
            if (user?.userState) {
                const response = await fetch(`${api}/order/get-orders/${user.userState._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store",
                    },
                    credentials: "include",
                    withCredentials: true,
                });

                const content = await response.json();
                setOrders(content.data);
            }
        })();
    }, [user]);


    const handleShow = () => {
        setShowOrderInfo(!showOrderInfo);
    };


    return (
        <Container fluid className="order-list-back">
            <div >
                {
                    showOrderInfo ?
                        (
                            <>
                                <OrderInfo handleShow={handleShow} order={orderToShow} />
                            </>
                        )

                        : (
                            <>
                                <MainHeading
                                    text="Order History"
                                    classes="text-center"
                                />

                                <div className="margin-global-top-2" />


                                <Container className="order-list">
                                    <Row>

                                        <div id="no-more-tables">
                                            <Table className="col-md-12 cf">
                                                <thead className='cf'>
                                                    <tr>
                                                        <th>Order No</th>
                                                        <th>Date</th>
                                                        <th>Order Total</th>
                                                        <th>Status</th>
                                                        <th>Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        orders.map((order, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td data-title="Order Number">{order.orderNumber}</td>
                                                                    <td data-title="Order Date">{new Date(order.orderDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                                                    <td data-title="Order Total">{order.totalPrice}</td>
                                                                    <td data-title="Order Status">{order.orderStatus ? <CheckIcon style={{ fill: "green" }} /> : <CloseIcon style={{ fill: "red" }} />}</td>
                                                                    <td data-title="Order Action">
                                                                        <Link
                                                                            to={""}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setOrderToShow(order);
                                                                                handleShow();
                                                                            }}>
                                                                            View Order
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Row>

                                </Container>

                            </>
                        )
                }
            </div>
        </Container>
    );
}

export default Orders;