import React, { useState } from "react";
import Container from "../Container";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../store/modules/auth/reducers";
import { unwrapResult } from "@reduxjs/toolkit";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);

  const dispatch = useDispatch();

  const canSubmit = email && password && !isAuthenticating;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let response = await dispatch(userLogin({ email, password }));
      // response = unwrapResult(response);
    } catch (error) {
      console.log(error);
      console.log("Failed to Login- Try again! ");
    }
  };

  return (
    <div className="home">
      <Container>
        <h1>WHO'S WHO?</h1>
        <form className="home__details" onSubmit={handleSubmit}>
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div>
            <label>Password: </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <button type="submit" disabled={!canSubmit}>
              {isAuthenticating ? "loading.." : "Login"}
            </button>
          </div>
        </form>

        {/* TODO: Use Link/NavLink  */}
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/guest">Play As Guest</NavLink>
      </Container>
    </div>
  );
};

export default Login;