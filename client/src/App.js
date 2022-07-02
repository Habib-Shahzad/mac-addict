import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Routes from "./Routes";
import { Admin } from "./admin";
import api from "./api";
import React, { useState, useEffect } from "react";
import UserContext from "./contexts/user";
import AdminUserContext from './contexts/adminUser';
import AddressContext from './contexts/address';


function App() {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUserState, setAdminUserState] = React.useState(null);

  const [selectedAddress, setSelectedAddress] = React.useState(null);


  useEffect(() => {
    (async () => {

      const response = await fetch(`${api}/user/loggedIn`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        credentials: "include",
        withCredentials: true,
      });

      const content = await response.json();

      if (content.successUser) {
        setUserState(content.user);
      }

      if (content.successAdmin) {
        setAdminUserState(content.admin_user);
      }

      setLoading(false);
    })();
  }, []);



  if (loading) return <div></div>;

  return (
    <AdminUserContext.Provider
      value={{ adminUserState: adminUserState, setAdminUserState: setAdminUserState }}
    >
      <UserContext.Provider
        value={{ userState: userState, setUserState: setUserState }}
      >
        <AddressContext.Provider value={{ selectedAddress: selectedAddress, setSelectedAddress: setSelectedAddress }}>
          <Router>
            <Switch>
              <Route path="/admin">
                <Admin loading={loading} />
              </Route>
              <Route path="*">
                <Routes />
              </Route>
            </Switch>
          </Router>
        </AddressContext.Provider>
      </UserContext.Provider>
    </AdminUserContext.Provider>

  );
}

export default App;
