import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Routes from "./Routes";
import { Admin } from "./admin";
import api from "./api";
import React, { useState, useEffect } from "react";
import UserContext from "./contexts/user";
import AdminUserContext from './contexts/adminUser';

function App() {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setUserState(content.data);

      setLoading(false);
    })();
  }, []);


  const [adminUserState, setAdminUserState] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`${api}/user/admin-loggedIn`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        credentials: "include",
        withCredentials: true,
      });

      const content = await response.json();
      setAdminUserState(content.data);
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
        <Router>
          <Switch>
            {/* <Route path="/thankyou" children={<Thankyou />} /> */}
            <Route path="/admin">
              <Admin loading={loading} />
            </Route>
            <Route path="*">
              <Routes />
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </AdminUserContext.Provider>

  );
}

export default App;
