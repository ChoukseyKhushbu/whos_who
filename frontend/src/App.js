import React, { useEffect } from "react";
import "./styles/global.scss";

import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import Register from "./components/Register";
import Guest from "./components/Guest";
import Login from "./components/Login";
import { getUser, populateUser } from "./store/modules/auth/reducers";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

function App() {
  const dispatch = useDispatch();
  const isPopulating = useSelector((state) => state.auth.isPopulating);

  useEffect(() => {
    console.log("useEffect");
    const fetchUser = async () => {
      console.log("fetchUser");
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const response = await dispatch(populateUser({ accessToken }));
          // const Unwrapped = unwrapResult(response);
        }
      } catch (error) {
        console.log("in error");
        console.log(error);
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <div className="App">
      <h1>isPopulating: {isPopulating.toString()}</h1>
      {isPopulating ? (
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
  const accessToken = localStorage.getItem("accessToken");
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
      render={({ location }) =>
        Object.keys(user).length > 0 ? (
          <Redirect to={{ pathname: "/", state: { from: location } }} />
        ) : (
          children
        )
      }
    />
  );
}
export default App;
