import axios from "axios";
import { authInterceptor } from "../interceptors";

const publicAPI = axios.create({
  baseURL: "http://localhost:5555/",
});

const privateAPI = axios.create({
  baseURL: "http://localhost:5555/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

privateAPI.interceptors.request.use(authInterceptor);

export { privateAPI, publicAPI };
