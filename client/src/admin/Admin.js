import React, { useContext, useState } from 'react';
import { Login, AdminLayout } from '../admin';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import './Admin.scss';
import UserContext from '../contexts/user';


function Admin(props) {
    const [darkState, setDarkState] = useState(false);
    const user = useContext(UserContext);
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
            {!user.userState ? (
                <Login user={user} title="MAC Addict: Admin Login" />
            ) : (
                <AdminLayout user={user} darkState={darkState} setDarkState={setDarkState} title="MAC Addict: Dashboard" />
            )}
        </ThemeProvider>
    );
}

export default Admin;