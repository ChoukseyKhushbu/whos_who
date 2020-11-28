import React, { useState } from "react";
import Container from "../Container";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { guestLogin } from "../../store/modules/auth/reducers";

const Login = () => {
  const [name, setName] = useState("");
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);

  const dispatch = useDispatch();
  const history = useHistory();

  const canSubmit = name && !isAuthenticating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(guestLogin({ username: name }));
      console.log(unwrapResult(response));
      setName("");
      history.push("/");
    } catch (error) {
      console.log("failed to login the guest- Try again! ");
    }
  };

  return (
    <div className="home">
      <Container>
        <h1>WHO'S WHO?</h1>
        <form className="home__details" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Your Name: </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            ></input>
          </div>
          <div>
            <button type="submit" disabled={!canSubmit}>
              {isAuthenticating ? "loading.." : "PLay As Guest"}
            </button>
          </div>
        </form>

        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/guest">Play As Guest</NavLink>
      </Container>
    </div>
  );
};

export default Login;
