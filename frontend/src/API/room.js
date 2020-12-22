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
  return privateAPI.post(`${ENDPOINT}/startgame`, {
    roomID,
    noOfQues,
    category,
  });
};

export const submitAnswerAPI = ({ roomID, answer }) => {
  return privateAPI.post(`${ENDPOINT}/submitanswer`, {
    roomID,
    answer,
  });
};
export const nextQuestionAPI = ({ roomID, answer }) => {
  return privateAPI.post(`${ENDPOINT}/nextquestion`, {
    roomID,
  });
};

export const updateOptionsAPI = ({ roomID, category, noOfQues }) => {
  return privateAPI.post(`${ENDPOINT}/updateOptions`, {
    roomID,
    noOfQues,
    category,
  });
};
export const clearRoomAPI = ({ roomID }) => {
  return privateAPI.post(`${ENDPOINT}/clearRoom`, {
    roomID,
  });
};
