import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Routes from "./Routes";
import { Admin } from "./admin";
import api from "./api";
import React, { useState, useEffect } from "react";
import UserContext from "./contexts/user";

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
      console.log("RESPONSE JSON", content);

      // try {
      //   const user = content.data;
      //   setUserState(user);
      // } catch (error) {
      //   setUserState(null);
      // }


      setLoading(false);
    })();
  }, []);

  if (loading) return <div></div>;

  return (
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
  );
}

export default App;
