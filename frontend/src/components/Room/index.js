import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  fetchRoom,
  getRoom,
  updateRoom,
  submitAnswer,
  getPlayersAnswered,
  getAnsByOption,
  nextQuestion,
  clearRoom,
} from "../../store/modules/room/reducers";
import { addMessage } from "../../store/modules/chat/reducers";
import Container from "../Container";
import { subscribeToRoom, subscribeToChat } from "../../utils/socket";
import "./styles.modules.scss";
import { getUser } from "../../store/modules/auth/reducers";
import WaitingRoom from "../WaitingRoom";
import Chat from "../Chat";
const Room = () => {
  const roomData = useSelector(getRoom);
  const user = useSelector(getUser);
  const isFetching = useSelector((state) => state.room.isFetching);
  const playersAnswered = useSelector(getPlayersAnswered);
  const ansByOption = useSelector(getAnsByOption);
  const dispatch = useDispatch();
  const { roomID } = useParams();
  const { room, isCreator, hasJoined } = roomData;

  const [optedAnswer, setoptedAnswer] = useState(null);
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

  const handleAnswer = async (answer) => {
    console.log("in handleAnswer: ", answer, " ", roomID);
    setoptedAnswer(answer);
    const response = await dispatch(submitAnswer({ roomID, answer }));
  };

  const handleNextQuestion = async () => {
    const response = await dispatch(nextQuestion({ roomID }));
  };
  const handleClearRoom = async () => {
    console.log("inside handleClearRoom");
    const response = await dispatch(clearRoom({ roomID }));
  };

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

  // if (Number(room.currentQuesIndex) === room.noOfQues - 1) {
  //   dispatch(clearRoom());
  // }
  return !room ? (
    <h1>Room Not Found</h1>
  ) : (
    <Container>
      <div className="room">
        <div className={!room.questions.length > 0 ? "main" : "game"}>
          <h2>Who's Who?</h2>
          {!room.questions.length > 0 ? (
            <WaitingRoom roomID={roomID} />
          ) : playersAnswered.indexOf(user.id) === -1 ? (
            room.questions?.length > 0 && (
              <div className="game">
                <p className="questions">{room.questions[0].question}</p>
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
              <p className="questions">{room.questions[0].question}</p>
              {Object.keys(room.players).map((player) => (
                <div key={player} className="options">
                  <p>{room.players[player].username}</p>
                  {room.answers[0][player].map((playerOpted) => (
                    <li key={playerOpted}>
                      {room.players[playerOpted].username[0]}
                    </li>
                  ))}
                </div>
              ))}
              {isCreator && (
                <button
                  onClick={
                    room.currentQuesIndex === room.noOfQues - 1
                      ? handleClearRoom
                      : handleNextQuestion
                  }
                  disabled={
                    playersAnswered.length !== Object.keys(room.players).length
                  }
                  className="NextQuesButton"
                >
                  {room.currentQuesIndex === room.noOfQues - 1
                    ? "Go to Waiting Room"
                    : "Next Question"}
                </button>
              )}
            </div>
          )}
        </div>
        <Chat roomID={roomID} />
      </div>
    </Container>
  );
};

export default Room;
