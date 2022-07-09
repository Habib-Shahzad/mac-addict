import React from 'react';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';


const createTableData = (data) => {
    return {
        _id: data._id,
        customerName: data.user.firstName + ' ' + data.user.lastName,
        orderNumber: data.orderNumber ?? "12345",
        totalPrice: data.totalPrice,
        orderDate: data.orderDate,
        orderStatus: data.orderStatus,
        order_data: { orderItems: data.orderItems, customer: data.user, deliveryAddress: data.deliveryAddress },
    };
}


const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'status') {
        const rows = [];
        let completed = true;
        if (obj.value === 'incomplete') completed = false;
        const response = await fetch(`${api}/order/set-complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ completed: completed, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
            rows.push(createTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }
}

const orderObj = {
    apiTable: `${api}/order/table-data`,
    deleteApi: `${api}/order/delete`,
    createTableData: createTableData,
    headCells: [
        { id: 'customerName', numeric: false, disablePadding: false, label: 'Customer Name' },
        { id: 'orderNumber', numeric: false, disablePadding: false, label: 'Order Number' },
        { id: 'totalPrice', numeric: false, disablePadding: false, label: 'Order Amount' },
        { id: 'orderDate', numeric: false, disablePadding: false, label: 'Order Date' },
        { id: 'orderStatus', numeric: false, disablePadding: false, label: 'Order Status' },

    ],
    ManyChild: '',
    checkboxSelection: '_id',
    Delete: function (items) {
        let html = [];
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            html.push(
                <TreeItem key={i} nodeId={`${element._id}`} label={element.name} />
            )
        }
        return html;
    },
    editAllowed: false,
    deleteAllowed: true,
    addAllowed: false,
    modelName: 'Order',
    ordering: 'orderDate',
    searchField: 'customerName',
    rightAllign: [],
    type: 'collapse',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
        { label: 'Set order status as completed', value: 'completed', type: 'status' },
        { label: 'Set order status as incomplete', value: 'incomplete', type: 'status' }
    ],
    Form: function (id, classes) {
        return (<></>);
    },
}

export default orderObj;