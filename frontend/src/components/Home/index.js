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
import "./styles.modules.scss";
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
      history.push(`/room/${room._id}`);
    } catch (error) {
      console.log("error in creating room");
      console.log(error);
    }
  };

  return (
    <Container>
      <h2>Who's Who?</h2>
      <div className="home">
        <div className="details">
          <p className="heading">
            Hello, {loggedUser ? loggedUser.username : ""}
          </p>
          <div className="cta">
            <button className="button" onClick={handleCreate}>
              Create Room
            </button>
            <button className="button">Join Room</button>
            <button className="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="instructions">
          <p className="heading">Instructions</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
            esse consequatur cumque sit obcaecati, voluptate impedit mollitia
            officiis iure sequi iste dolorem vel voluptas illum velit beatae hic
            suscipit.Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Cupiditate esse consequatur cumque sit obcaecati, voluptate impedit
            mollitia officiis iure sequi iste dolorem vel voluptas illum velit
            beatae hic suscipit.Cupiditate esse consequatur cumque sit
            obcaecati, voluptate impedit mollitia officiis iure sequi iste
            dolorem vel voluptas illum velit beatae hic suscipit.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
