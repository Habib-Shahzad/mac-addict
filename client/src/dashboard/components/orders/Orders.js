import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MainHeading } from '../../../components';
import { MDBDataTable } from 'mdbreact';
import './Orders.scss';

function Orders(props) {
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-GB', dateOptions);
    const data = {
        columns: [
            {
                label: 'Order No',
                field: 'orderNumber',
                width: 200
            },
            {
                label: 'Date',
                field: 'date',
                width: 270
            },
            {
                label: 'Customer Name',
                field: 'customerName',
                width: 300
            },
            {
                label: 'Order Total',
                field: 'orderTotal',
                width: 100
            },
            {
                label: 'Order Status',
                field: 'orderStatus',
                width: 200
            },
            {
                label: 'Action',
                field: 'action',
                width: 300
            }
        ],
        rows: [
            {
                orderNumber: '2000420239',
                date: date,
                customerName: 'Murtaza Faisal Shafi',
                orderTotal: 'PKR 6000/-',
                orderStatus: 'Completed',
                action: <div>
                    <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                </div>
            },
            {
                orderNumber: '2000420239',
                date: date,
                customerName: 'Murtaza Faisal Shafi',
                orderTotal: 'PKR 6000/-',
                orderStatus: 'Completed',
                action: <div>
                    <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                </div>
            },
            {
                orderNumber: '2000420239',
                date: date,
                customerName: 'Murtaza Faisal Shafi',
                orderTotal: 'PKR 6000/-',
                orderStatus: 'Completed',
                action: <div>
                    <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                </div>
            },
            {
                orderNumber: '2000420239',
                date: date,
                customerName: 'Murtaza Faisal Shafi',
                orderTotal: 'PKR 6000/-',
                orderStatus: 'Completed',
                action: <div>
                    <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                </div>
            },
            {
                orderNumber: '2000420239',
                date: date,
                customerName: 'Murtaza Faisal Shafi',
                orderTotal: 'PKR 6000/-',
                orderStatus: 'Completed',
                action: <div>
                    <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                </div>
            },
        ]
    };
    return (
        <div>
            <MainHeading
                text="Order History"
                classes="text-center"
            />
            <div className="margin-global-top-2" />
            <Container className="my-orders box-info">
                <MDBDataTable
                    // striped
                    // bordered
                    sortable={false}
                    small
                    responsiveXl
                    searching={false}
                    data={data}
                />
                {/* <Table striped bordered hover responsive="xl">
                    <thead>
                        <tr>
                            <th>Order No.</th>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Order Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2000420239</td>
                            <td>{date}</td>
                            <td>Murtaza Faisal Shafi</td>
                            <td>PKR 6000/-</td>
                            <td>Completed</td>
                            <td>
                                <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                            </td>
                        </tr>
                        <tr>
                            <td>2000420239</td>
                            <td>{date}</td>
                            <td>Murtaza Faisal Shafi</td>
                            <td>PKR 6000/-</td>
                            <td>Completed</td>
                            <td>
                                <Link to="/dashboard/view-order/2000420239">View Order</Link> <span>|</span> <Link to="/dashboard/reorder/2000420239">Reorder</Link>
                            </td>
                        </tr>
                </Table> */}
            </Container>
        </div>
    );
}

export default Orders;