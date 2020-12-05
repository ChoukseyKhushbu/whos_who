import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./modules/auth/reducers";
import chatReducer from "./modules/chat/reducers";
import roomReducer from "./modules/room/reducers";

export default configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    room: roomReducer,
  },
});
