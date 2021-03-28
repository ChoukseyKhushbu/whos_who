import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRoomAPI,
  fetchRoomAPI,
  joinRoomAPI,
  startGameAPI,
  submitAnswerAPI,
  nextQuestionAPI,
  updateOptionsAPI,
  clearRoomAPI,
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

export const submitAnswer = createAsyncThunk(
  "room/submitAnswer",
  async ({ roomID, answer }) => {
    const response = await submitAnswerAPI({ roomID, answer });
    return response.data;
  }
);

export const nextQuestion = createAsyncThunk(
  "room/nextQuestion",
  async ({ roomID }) => {
    const response = await nextQuestionAPI({ roomID });
    return response.data;
  }
);

export const updateOptions = createAsyncThunk(
  "room/updateOptions",
  async ({ roomID, noOfQues, category }) => {
    const response = await updateOptionsAPI({ roomID, noOfQues, category });
    return response.data;
  }
);

export const clearRoom = createAsyncThunk(
  "room/clearRoom",
  async ({ roomID }) => {
    const response = await clearRoomAPI({ roomID });
    return response.data;
  }
);

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomData: {
      // room: { category: "General", noOfQues: 3 },
    },
    isCreating: false,
    isFetching: false,
    isQuesFetching: false,
    gameStarted: false,
  },
  reducers: {
    updateRoom: (state, action) => {
      console.log("in update reducer -");
      console.log(action.payload);
      // let { players } = action.payload;
      let players = action.payload.players.reduce(
        (acc, player) => ({ ...acc, [player._id]: player }),
        {}
      );
      state.roomData.room = { ...action.payload, players };
    },
  },
  extraReducers: {
    [createRoom.pending]: (state, action) => {
      state.isCreating = true;
    },
    [createRoom.fulfilled]: (state, action) => {
      state.isCreating = false;
      const { room, isCreator, hasJoined } = action.payload.data;
      room.players = room.players.reduce(
        (acc, player) => ({ ...acc, [player._id]: player }),
        {}
      );
      state.roomData = { room, isCreator, hasJoined };
      console.log("in createroom reducer - ");

      console.log(state.roomData);
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
      room.players = room.players.reduce(
        (acc, player) => ({ ...acc, [player._id]: player }),
        {}
      );
      state.roomData = { room, isCreator, hasJoined };
      console.log("in fetchh room -----------");
      console.log(state.roomData);
    },
    [fetchRoom.rejected]: (state, action) => {
      state.isFetching = false;
    },

    [joinRoom.pending]: (state, action) => { },
    [joinRoom.fulfilled]: (state, action) => {
      const { room, hasJoined } = action.payload.data;
      room.players = room.players.reduce(
        (acc, player) => ({ ...acc, [player._id]: player }),
        {}
      );
      state.roomData = { ...state.roomData, room, hasJoined };
    },
    [joinRoom.rejected]: (state, action) => { },

    [startGame.pending]: (state, action) => {
      state.isQuesFetching = true;
    },
    [startGame.fulfilled]: (state, action) => {
      state.isQuesFetching = false;
    },
    [startGame.rejected]: (state, action) => {
      state.isQuesFetching = false;
    },
    [submitAnswer.pending]: (state, action) => { },
    [submitAnswer.fulfilled]: (state, action) => { },
    [submitAnswer.rejected]: (state, action) => { },
    [updateOptions.pending]: (state, action) => { },
    [updateOptions.fulfilled]: (state, action) => { },
    [updateOptions.rejected]: (state, action) => { },
    [clearRoom.pending]: (state, action) => { },
    [clearRoom.fulfilled]: (state, action) => { },
    [clearRoom.rejected]: (state, action) => { },
  },
});

export const { updateRoom } = roomSlice.actions;

export const getRoom = (state) => state.room.roomData;

// export const getPlayersById = (state) => {
//   let { roomData } = state.room;
//   if (roomData.room) {
//     let { players } = roomData.room;
//     if (players) {
//       return roomData.room.players.reduce(
//         (acc, player) => ({ ...acc, [player._id]: player }),
//         {}
//       );
//     }
//   }
//   return {};
// };

export const getPlayersAnswered = (state) => {
  let arr = [];
  let { roomData } = state.room;
  if (roomData.room) {
    let { currentAnswer, currentQuesIndex } = roomData.room;
    // if(answers && currentQuesIndex)
    if (currentQuesIndex != null) {
      // let currQuesAns = answers;
      for (let option of Object.keys(currentAnswer)) {
        arr = [...arr, ...currentAnswer[option]];
      }
    }
  }
  return arr;
};

export const getAnsByOption = (state) => (option) => {
  let { roomData } = state.room;
  let { answers, currentQuesIndex } = roomData.room;
  if (roomData.room && currentQuesIndex) {
    let currQuesAns = answers[currentQuesIndex];
    console.log(currQuesAns[option]);
    return currQuesAns[option];
  } else {
    return [];
  }
};
export default roomSlice.reducer;
