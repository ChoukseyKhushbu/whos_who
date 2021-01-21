import io from "socket.io-client";
console.log(`socket.js`);
const socket = io("http://localhost:5555", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.warn(`socket connection - ${socket.id}`); // x8WIv7-mJelg7on_ALbx
});

function subscribeToRoom(cb) {
  socket.on("roomChange", cb);
}

function subscribeToChat(cb) {
  socket.on("chat", cb);
}

function joinSocketRoom({ roomID }) {
  socket.emit("joinRoom", roomID);
}
function emitMessage({ message, playerName, time, playerID }) {
  console.log("in emit message: ", message);
  socket.emit("chat", {
    message: message,
    playerName: playerName,
    time: time,
    playerID: playerID,
  });
}
export { subscribeToRoom, subscribeToChat, joinSocketRoom, emitMessage };
