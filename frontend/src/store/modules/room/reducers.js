import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRoomAPI,
  fetchRoomAPI,
  joinRoomAPI,
  startGameAPI,
} from "../../../API/room";

export const createRoom = createAsyncThunk("room/createRoom", async () => {
  const response = await createRoomAPI();
  return response.data;
});

export const fetchRoom = createAsyncThunk(
  "room/fetchRoom",
  async ({ roomID }) => {
    const response = await fetchRoomAPI({ roomID });
    return response.data;
  }
);

export const joinRoom = createAsyncThunk(
  "room/joinRoom",
  async ({ roomID }) => {
    const response = await joinRoomAPI({ roomID });
    return response.data;
  }
);

export const startGame = createAsyncThunk(
  "room/startGame",
  async ({ roomID, noOfQues, category }) => {
    const response = await startGameAPI({ roomID, noOfQues, category });
    return response.data;
  }
);

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomData: {},
    isCreating: false,
    isFetching: false,
    isQuesFetching: false,
    gameStarted: false,
  },
  reducers: {
    updateRoom: (state, action) => {
      console.log(action.payload);
      let { players } = action.payload;
      state.roomData.room = { ...state.roomData.room, players };
    },
  },
  extraReducers: {
    [createRoom.pending]: (state, action) => {
      state.isCreating = true;
    },
    [createRoom.fulfilled]: (state, action) => {
      state.isCreating = false;
      const { room, isCreator, hasJoined } = action.payload.data;
      state.roomData = { room, isCreator, hasJoined };
    },
    [createRoom.rejected]: (state, action) => {
      state.isCreating = false;
    },

    [fetchRoom.pending]: (state, action) => {
      state.isFetching = true;
    },
    [fetchRoom.fulfilled]: (state, action) => {
      state.isFetching = false;
      const { room, isCreator, hasJoined } = action.payload.data;

      state.roomData = { room, isCreator, hasJoined };
      state.gameStarted = room.questions.length > 0;
    },
    [fetchRoom.rejected]: (state, action) => {
      state.isFetching = false;
    },

    [joinRoom.pending]: (state, action) => {
      // state.isCreating = true;
    },
    [joinRoom.fulfilled]: (state, action) => {
      // state.isCreating = false;
      const { room, hasJoined } = action.payload.data;
      state.roomData = { ...state.roomData, room, hasJoined };
    },
    [joinRoom.rejected]: (state, action) => {
      // state.isCreating = false;
    },

    [startGame.pending]: (state, action) => {
      state.isQuesFetching = true;
    },
    [startGame.fulfilled]: (state, action) => {
      state.isQuesFetching = false;
      const { room } = action.payload.data;
      state.roomData = { ...state.roomData, room };
      state.gameStarted = room.questions.length > 0;
    },
    [startGame.rejected]: (state, action) => {
      state.isQuesFetching = false;
    },
  },
});

export const { updateRoom } = roomSlice.actions;

export const getRoom = (state) => state.room.roomData;

export default roomSlice.reducer;
