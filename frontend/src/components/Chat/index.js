import React, { useEffect, useState } from "react";
import { emitMessage, subscribeToChat } from "../../utils/socket";
import { getMessages, addMessage } from "../../store/modules/chat/reducers";
import { getUser } from "../../store/modules/auth/reducers";
import { getRoom, joinRoom } from "../../store/modules/room/reducers";

import { useSelector, useDispatch } from "react-redux";

const Chat = ({ roomID }) => {
  const [chatMessage, setChatMessage] = useState("");
  const messages = useSelector(getMessages);
  const user = useSelector(getUser);
  const roomData = useSelector(getRoom);

  const dispatch = useDispatch();

  const { hasJoined } = roomData;

  useEffect(() => {
    subscribeToChat(function (data) {
      let { message, player } = data;
      console.log("in useeffect of message", message);
      dispatch(addMessage({ message, player }));
    });
  }, [dispatch]);

  const handleChatMessage = async (e) => {
    setChatMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let message = chatMessage;
    let player = user.username;
    emitMessage({ message, player });
    setChatMessage("");
  };

  const handleJoinOnClick = async () => {
    const response = await dispatch(joinRoom({ roomID }));
    console.log(response);
  };

  return (
    <div className="chat">
      <p className="heading">Chat</p>
      <div className="chat_window">
        {messages.map((m) => (
          <p>
            {m.player}: {m.message}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message"
          value={chatMessage}
          onChange={handleChatMessage}
        ></input>
        <button className="sendMessage" disabled={!chatMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
      {!hasJoined && (
        <div class="lock-bg" onClick={handleJoinOnClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none">
              <path d="M0 0h24v24H0V0z" />
              <path d="M0 0h24v24H0V0z" opacity=".87" />
            </g>
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
          </svg>
          <p>Join the room to chat!</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
