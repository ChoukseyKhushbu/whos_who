import { privateAPI } from "./clients";

const ENDPOINT = "/room";

export const createRoomAPI = () => {
  return privateAPI.get(`${ENDPOINT}/create`);
};

export const fetchRoomAPI = ({ roomID }) => {
  return privateAPI.get(`${ENDPOINT}/data/${roomID}`);
};

export const joinRoomAPI = ({ roomID }) => {
  return privateAPI.get(`${ENDPOINT}/join/${roomID}`);
};

export const startGameAPI = ({ roomID, noOfQues, category }) => {
  console.log({ roomID, noOfQues, category });
  return privateAPI.post(`${ENDPOINT}/game`, {
    roomID,
    noOfQues,
    category,
  });
};
