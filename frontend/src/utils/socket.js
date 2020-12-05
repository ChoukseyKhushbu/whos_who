import io from "socket.io-client";

const socket = io("http://localhost:5555", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

function subscribeToRoom(cb) {
  console.log("inside function");
  socket.on("roomChange", cb);
}

function subscribeToGame(cb) {
  socket.on("startGame", cb);
}

export { subscribeToRoom, subscribeToGame };
