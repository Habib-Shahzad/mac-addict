import React, { useState } from 'react';
import { Login, AdminLayout } from '../admin';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './Admin.scss';
import AdminUserContext from '../contexts/adminUser';

function Admin(props) {

    const adminUser = React.useContext(AdminUserContext);

    const [darkState, setDarkState] = useState(false);

    const darkTheme = createTheme({
        palette: {
            type: 'dark',
            primary: {
                main: '#CF993D',
            },
            secondary: {
                main: '#c51162',
            },
            error: {
                main: '#c31200',
            },
        },
        typography: {
            fontFamily: 'Montserrat',
        },
    });

    const lightTheme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#CF993D',
            },
            secondary: {
                main: '#c51162',
            },
            error: {
                main: '#d50000',
            },
        },
        typography: {
            fontFamily: 'Montserrat',
        },
    });
    const currentTheme = darkState ? darkTheme : lightTheme;

    if (props.loading) return <div></div>

    return (
        <ThemeProvider theme={currentTheme}>
            {!adminUser.adminUserState ? (
                <Login user={adminUser} title="MAC Addict: Admin Login" />
            ) : (
                <AdminLayout user={adminUser} darkState={darkState} setDarkState={setDarkState} title="MAC Addict: Dashboard" />
            )}
        </ThemeProvider>
    );
}

export default Admin;