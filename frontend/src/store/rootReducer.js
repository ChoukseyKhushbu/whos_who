import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./modules/auth/reducers";
import chatReducer from "./modules/chat/reducers";

export default configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
