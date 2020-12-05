import React from "react";
import Container from "../Container";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  getUser,
  getAccessToken,
} from "../../store/modules/auth/reducers";
import { createRoom } from "../../store/modules/room/reducers";
import { unwrapResult } from "@reduxjs/toolkit";

const Home = () => {
  const loggedUser = useSelector(getUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const accessToken = useSelector(getAccessToken);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreate = async () => {
    try {
      let response = await dispatch(createRoom({ accessToken }));
      response = unwrapResult(response);
      const { room } = response.data;
      history.push(`/room/${room.id}`);
    } catch (error) {
      console.log("error in creating room");
      console.log(error);
    }
  };

  return (
    <div className="home">
      <Container>
        <div className="home__details">
          <h1>Helloooww! {loggedUser ? loggedUser.username : ""}</h1>
          <div className="buttons">
            <button onClick={handleCreate}>Create Room</button>
            {/* <button>Join Room</button> */}
          </div>
          <div>Instructions to play!</div>
          <div>Your stats</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
