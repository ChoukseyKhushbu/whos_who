import React from "react";
import Container from "../Container";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GuestLogout, getUser } from "../../store/modules/auth/reducers";

const Home = () => {
  const loggedUser = useSelector(getUser);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(GuestLogout());
    history.push("/guest");
  };

  return (
    <div className="home">
      <Container>
        <form className="home__details">
          <h1>Helloooww! {loggedUser ? loggedUser.username : ""}</h1>
          <div className="buttons">
            <button>Create Room</button>
            <button>Join Room</button>
          </div>
          <div>Instructions to play!</div>
          <div>Your stats</div>
          <button onClick={handleLogout}>Logout</button>
        </form>
      </Container>
    </div>
  );
};

export default Home;
