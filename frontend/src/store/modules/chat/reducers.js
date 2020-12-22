import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      const { message, player } = action.payload;
      console.log("in add message reducer");
      console.log(action.payload);
      state.messages = [...state.messages, { player, message }];
    },
  },
});
export const { addMessage } = chatSlice.actions;

export const getMessages = (state) => state.chat.messages;

export default chatSlice.reducer;
