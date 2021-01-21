import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      const { message, playerName, playerID, time } = action.payload;
      console.log("in add message reducer");
      console.log(action.payload);
      state.messages = [
        ...state.messages,
        { playerName, playerID, message, time },
      ];
    },
  },
});
export const { addMessage } = chatSlice.actions;

export const getMessages = (state) => state.chat.messages;

export default chatSlice.reducer;
