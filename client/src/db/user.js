import React from 'react';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';


const createTableData = (data) => {
    const { _id, firstName, lastName, email, contactNumber, active, admin } = data;
    return { _id, firstName, lastName, email, contactNumber, active, admin };
}



const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/user/set-active`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ active: active, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
            rows.push(createTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }

    if (obj.type === 'admin') {
        const rows = [];
        let admin = true;
        if (obj.value === 'non-admin') admin = false;
        const response = await fetch(`${api}/user/set-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ admin: admin, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
            rows.push(createTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }
}

const userObj = {
    apiTable: `${api}/user/table-data`,
    deleteApi: `${api}/user/delete`,
    createTableData: createTableData,
    headCells: [
        { id: 'firstName', numeric: false, disablePadding: true, label: 'First Name' },
        { id: 'lastName', numeric: false, disablePadding: true, label: 'Last Name' },
        { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
        { id: 'contactNumber', numeric: false, disablePadding: false, label: 'Contact' },
        { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
        { id: 'admin', numeric: false, disablePadding: false, label: 'Admin' },
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
    modelName: 'User',
    ordering: 'firstName',
    searchField: 'firstName',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
        { label: 'Set active', value: 'active', type: 'active' },
        { label: 'Set in-active', value: 'in-active', type: 'active' },
        { label: 'Set admin', value: 'admin', type: 'admin' },
        { label: 'Set non-admin', value: 'non-admin', type: 'admin' },
    ],
    Form: function (id, classes) {
        return (<></>);
    },
}

export default userObj;