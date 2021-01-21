import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoom,
  joinRoom,
  startGame,
  updateOptions,
} from "../../store/modules/room/reducers";
import "../Room/styles.modules.scss";

const WaitingRoom = ({ roomID }) => {
  const roomData = useSelector(getRoom);
  const dispatch = useDispatch();

  const { room, isCreator, hasJoined } = roomData;

  const handleJoin = async () => {
    const response = await dispatch(joinRoom({ roomID }));
    console.log(response);
  };

  const handleStart = async () => {
    const { noOfQues, category } = room;
    const response = await dispatch(startGame({ roomID, noOfQues, category }));
    console.log(response);
  };

  const changeOptions = async (e) => {
    console.log("in changeOPtions fnction");
    if (!isCreator) {
      return;
    }
    switch (e.target.name) {
      case "category":
        let category = e.target.value;
        await dispatch(updateOptions({ roomID, category }));
        return;
      case "noOfQues":
        let noOfQues = e.target.value;
        await dispatch(updateOptions({ roomID, noOfQues }));
        return;
      default:
        return;
    }
  };

  return (
    <>
      {/* <div className="main">
        <h2>Who's Who?</h2> */}
      {/* {!room.questions.length > 0 && ( */}
      <>
        <div className="game_options">
          <p className="heading">Game Options</p>
          <div className="dropdown">
            <div>
              <label htmlFor="category">Category</label>
              <select
                name="category"
                onChange={(e) => changeOptions(e)}
                disabled={!isCreator}
                value={room.category}
              >
                <option value="General">General</option>
                <option value="Sarcastic">Sarcastic</option>
                <option value="Humour">Humour</option>
                <option value="Adventure">Adventure</option>
                <option value="18">18+</option>
              </select>
            </div>
            <div>
              <label htmlFor="noOfQues">No. of Questions</label>
              <select
                name="noOfQues"
                onChange={(e) => changeOptions(e)}
                disabled={!isCreator}
                value={room.noOfQues}
              >
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
          {isCreator && (
            <button
              className="button"
              onClick={handleStart}
              disabled={
                !(
                  room.category &&
                  room.noOfQues &&
                  Object.keys(room.players).length > 1
                )
              }
            >
              Start Game
            </button>
          )}
          {!hasJoined && (
            <button className="button" onClick={handleJoin}>
              Join Game
            </button>
          )}
        </div>
        <div className="lobby">
          <p className="heading">Waiting Room</p>
          {Object.entries(room.players).map(([id, player]) => (
            <li key={id}>{player.username}</li>
          ))}
        </div>
      </>
      {/* )} */}
      {/* </div> */}
    </>
  );
};

export default WaitingRoom;
