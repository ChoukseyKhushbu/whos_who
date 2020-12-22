import io from "socket.io-client";

const socket = io("http://localhost:5555", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

function subscribeToRoom(cb) {
  socket.on("roomChange", cb);
}

function subscribeToChat(cb) {
  // socket.on("startGame", cb);
  socket.on("chat", cb);
}

function emitMessage({ message, player }) {
  console.log("in emit message: ", message);
  socket.emit("chat", {
    message: message,
    player: player,
  });
}
export { subscribeToRoom, subscribeToChat, emitMessage };
