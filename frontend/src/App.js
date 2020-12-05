import React, { useEffect, useState } from "react";
import "./styles/global.scss";

import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import Register from "./components/Register";
import Guest from "./components/Guest";
import Login from "./components/Login";
import {
  getAccessToken,
  getUser,
  populateUser,
} from "./store/modules/auth/reducers";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

function App() {
  const [isPopulated, setIsPopulated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const response = await dispatch(populateUser());
          // const Unwrapped = unwrapResult(response);
        }
      } catch (error) {
        console.log("in error");
        console.log(error);
      }
      setIsPopulated(true);
    };
    fetchUser();
  }, [dispatch]);

  return (
    <div className="App">
      {!isPopulated ? (
        "loading.."
      ) : (
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>
          <AuthRoute path="/register">
            <Register />
          </AuthRoute>
          <AuthRoute path="/login">
            <Login />
          </AuthRoute>
          <AuthRoute path="/guest">
            <Guest />
          </AuthRoute>
          <PrivateRoute path="/room/:roomID">
            <Room />
          </PrivateRoute>
        </Switch>
      )}
    </div>
  );
}

function PrivateRoute({ children, ...rest }) {
  const accessToken = useSelector(getAccessToken);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        accessToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/guest",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function AuthRoute({ children, ...rest }) {
  const user = useSelector(getUser);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return Object.keys(user).length > 0 ? (
          <Redirect to={location.state?.from.pathname || "/"} />
        ) : (
          children
        );
      }}
    />
  );
}
export default App;
