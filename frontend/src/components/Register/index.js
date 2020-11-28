import React, { useState } from "react";
import Container from "../Container";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getError, register } from "../../store/modules/auth/reducers";
import { unwrapResult } from "@reduxjs/toolkit";

const Register = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);

  const dispatch = useDispatch();

  const canSubmit = username && email && password && !isAuthenticating;
  const errror = useSelector(getError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await dispatch(register({ username, email, password }));
      response = unwrapResult(response);
    } catch (error) {
      console.log(errror);
      console.log("Failed to Register- Try again! ");
    }
  };

  return (
    <div className="home">
      <Container>
        <h1>WHO'S WHO?</h1>
        <form className="home__details" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Name: </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            ></input>
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            ></input>
          </div>

          <div>
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <button type="submit" disabled={!canSubmit}>
              {isAuthenticating ? "loading.." : "Register"}
            </button>
          </div>
        </form>

        {/* TODO: Use Link/NavLink  */}
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/guest">Play As Guest</NavLink>

        <br />
        <br />
      </Container>
    </div>
  );
};

export default Register;
