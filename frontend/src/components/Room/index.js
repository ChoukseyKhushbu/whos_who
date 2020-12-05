import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchRoom,
  getRoom,
  joinRoom,
  startGame,
  updateRoom,
} from "../../store/modules/room/reducers";
import Container from "../Container";
import { subscribeToRoom } from "../../utils/socket";
import "./styles.modules.scss";
const Room = () => {
  const roomData = useSelector(getRoom);
  const isFetching = useSelector((state) => state.room.isFetching);
  const dispatch = useDispatch();
  const { roomID } = useParams();
  const { room, isCreator, hasJoined } = roomData;

  const [category, setCategory] = useState("General");
  const [noOfQues, setNoOfQues] = useState(3);

  useEffect(() => {
    console.log("subscribe to room called");
    subscribeToRoom((room) => {
      console.log(room);

      //updateRoom() to update the room in place without network request

      dispatch(updateRoom(room));
    });
  }, [dispatch, roomID]);

  useEffect(() => {
    if (!Object.keys(roomData).length) {
      console.log("calling refresh wla useeffect");
      (async () => {
        const response = await dispatch(fetchRoom({ roomID }));
        console.log(response);
      })();
    }
  }, [dispatch, roomID, roomData]);

  const handleJoin = async () => {
    const response = await dispatch(joinRoom({ roomID }));
    console.log(response);
  };

  const handleStart = async () => {
    const response = await dispatch(startGame({ roomID, noOfQues, category }));
    console.log(response);
  };

  return !isFetching ? (
    room ? (
      <div className="room">
        <Container>
          <div className="lobby">
            <h3>Waiting Room</h3>
            {room.players.map((player) => (
              <li key={player._id}>{player.username}</li>
            ))}
          </div>
          <div className="game_options">
            <h3>Game Options</h3>

            <div>
              <label htmlFor="category">Category</label>
              <select
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                disabled={!isCreator}
              >
                <option value="General">General</option>
                <option value="Sarcastic">Sarcastic</option>
                <option value="Humour">Humour</option>
                <option value="Adventure">Adventure</option>
                <option value="18">18+</option>
              </select>
            </div>
            <div>
              <label htmlFor="noOfQues">Number of Questions</label>
              <select
                name="noOfQues"
                onChange={(e) => setNoOfQues(e.target.value)}
                disabled={!isCreator}
              >
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
            <div className="buttons">
              {isCreator && <button onClick={handleStart}>Start Game</button>}
              {!hasJoined && <button onClick={handleJoin}>Join Game</button>}
            </div>
          </div>

          <div className="questions">
            {room.questions?.length &&
              room.questions.map((ques) => (
                <li key={ques._id}>{ques.question}</li>
              ))}
          </div>
        </Container>
      </div>
    ) : (
      <h1>Room Not Found</h1>
    )
  ) : (
    <h1>FFEEETTCHHINNGG...</h1>
  );
};

export default Room;
