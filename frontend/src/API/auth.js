import { privateAPI, publicAPI } from "./clients";

const ENDPOINT = "/auth";

export const loginAPI = ({ email, password }) => {
  return publicAPI.post(`${ENDPOINT}/login`, {
    email,
    password,
  });
};

export const registerAPI = ({ email, password, username }) => {
  return publicAPI.post(`${ENDPOINT}/register`, {
    email,
    password,
    username,
  });
};

export const guestAPI = ({ username }) => {
  return publicAPI.post(`${ENDPOINT}/guest`, {
    username,
  });
};

export const populateUserAPI = () => {
  return privateAPI.get(`${ENDPOINT}/populateUser`);
};
