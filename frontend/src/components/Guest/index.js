import React, { useState } from "react";
import Container from "../Container";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { guestLogin } from "../../store/modules/auth/reducers";
import AuthLinks from "../AuthLinks";
import "./styles.modules.scss";
const Guest = () => {
  const [name, setName] = useState("");
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);

  const dispatch = useDispatch();

  const canSubmit = name && !isAuthenticating;

  const handleSubmit = async () => {
    try {
      const response = await dispatch(guestLogin({ username: name }));
      console.log(unwrapResult(response));
    } catch (error) {
      console.log("failed to login the guest- Try again! ");
    }
  };

  return (
    <Container>
      <h1>WHO'S WHO?</h1>
      <div className="home__details" style={{ paddingTop: "50px" }}>
        <div>
          <input
            className="inputField"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Your Name"
          ></input>
        </div>
        <div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="button"
          >
            {isAuthenticating ? "loading.." : "Play As Guest"}
          </button>
        </div>
      </div>

      <AuthLinks />
    </Container>
  );
};

export default Guest;
