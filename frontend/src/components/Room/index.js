import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  fetchRoom,
  getRoom,
  joinRoom,
  startGame,
  updateRoom,
  submitAnswer,
  getPlayersAnswered,
  getAnsByOption,
  nextQuestion,
} from "../../store/modules/room/reducers";
import Container from "../Container";
import { subscribeToRoom } from "../../utils/socket";
import "./styles.modules.scss";
import { getUser } from "../../store/modules/auth/reducers";
const Room = () => {
  const roomData = useSelector(getRoom);
  const user = useSelector(getUser);
  const isFetching = useSelector((state) => state.room.isFetching);
  const playersAnswered = useSelector(getPlayersAnswered);
  // const playersById = useSelector(getPlayersById);
  const ansByOption = useSelector(getAnsByOption);
  const dispatch = useDispatch();
  const { roomID } = useParams();
  const { room, isCreator, hasJoined } = roomData;

  const [category, setCategory] = useState("General");
  const [noOfQues, setNoOfQues] = useState(3);
  const [optedAnswer, setoptedAnswer] = useState(null);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    console.log("subscribe to room called");
    subscribeToRoom((room) => {
      console.log("in Room component use effect- ");
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

  const handleAnswer = async (answer) => {
    console.log("in handleAnswer: ", answer, " ", roomID);
    setoptedAnswer(answer);
    const response = await dispatch(submitAnswer({ roomID, answer }));
  };

  const handleNextQuestion = async () => {
    const response = await dispatch(nextQuestion({ roomID }));
  };

  const handleChatMessage = async (e) => {
    setChatMessage(e.target.value);
  };

  // const temp = (option) => {
  //   return ansByOption(option);
  // };
  if (isFetching) {
    return <h1>FETCHING...</h1>;
  }
  if (!room) {
    return <h1>Room Not Found</h1>;
  }
  if (room.gameStarted && !room.players[user.id]) {
    return (
      <>
        <h1>Game Already Started</h1>
        <Link to="/" className="LinkButton">
          Home
        </Link>
      </>
    );
  }
  return !room ? (
    <h1>Room Not Found</h1>
  ) : (
    <Container>
      <div className="room">
        <div className={!room.questions.length > 0 ? "main" : "game"}>
          <h2>Who's Who?</h2>
          {!room.questions.length > 0 ? (
            <>
              <div className="game_options">
                <p className="heading">Game Options</p>
                <div className="dropdown">
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
                </div>
                {isCreator && (
                  <button
                    className="button"
                    onClick={handleStart}
                    disabled={!(category && noOfQues)}
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
          ) : playersAnswered.indexOf(user.id) === -1 ? (
            room.questions?.length > 0 && (
              <div className="game">
                <p className="questions">
                  {room.questions[room.currentQuesIndex].question}
                </p>
                <div className="optionList">
                  {Object.entries(room.players).map(([id, player]) => (
                    <div
                      className="options"
                      disabled={optedAnswer}
                      key={id}
                      value={id}
                      onClick={() => handleAnswer(id)}
                    >
                      {player.username}
                    </div>
                  ))}
                </div>
                {isCreator && (
                  <button
                    onClick={handleNextQuestion}
                    disabled={playersAnswered.length !== room.players.length}
                    className="NextQuesButton"
                  >
                    Next Question
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="result_section">
              <p className="questions">
                {room.questions[room.currentQuesIndex].question}
              </p>
              {/* {console.log("IN COMPONENT")} */}
              {Object.keys(room.players).map((player) => (
                <div key={player} className="options">
                  <p>{room.players[player].username}</p>
                  {room.answers[room.currentQuesIndex][player].map(
                    (playerOpted) => (
                      <li key={playerOpted}>
                        {room.players[playerOpted].username[0]}
                      </li>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="chat">
          <p className="heading">Chat</p>
          <input
            type="text"
            placeholder="Type a message"
            value=""
            onChange={handleChatMessage}
          ></input>
        </div>
      </div>
    </Container>
  );
};

export default Room;

// {isCreator && (
//   <button
//   >
//     Next Question
//   </button>
// )}
