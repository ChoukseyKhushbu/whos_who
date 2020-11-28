import React from "react";
import Container from "../Container";
const Room = () => {
  return (
    <div className="room">
      <Container>
        <form className="home__details">
          <div>
            <label> No. Of Rounds </label>
            <select name="rounds">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label>Category</label>
            <select name="category">
              <option value="General">General</option>
              <option value="humour">humour</option>
              <option value="18+">18+</option>
              <option value="sarcastic">sarcastic</option>
            </select>
          </div>
          <div className="buttons">
            <button>Start Game</button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Room;
