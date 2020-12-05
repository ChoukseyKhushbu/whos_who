import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./styles.modules.scss";
const AuthLinks = () => {
  const location = useLocation();
  let locationState = location.state || { from: { pathname: "/" } };

  return (
    <>
      <NavLink to={{ pathname: "/register", state: locationState }}>
        Register
      </NavLink>
      <NavLink to={{ pathname: "/login", state: locationState }}>Login</NavLink>
      <NavLink to={{ pathname: "/guest", state: locationState }}>
        Play As Guest
      </NavLink>
    </>
  );
};

export default AuthLinks;
