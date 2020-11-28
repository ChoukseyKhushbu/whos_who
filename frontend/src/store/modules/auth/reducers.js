import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// TODO: Hit auth/guest

export const populateUser = createAsyncThunk(
  "auth/populateUser",
  async ({ accessToken }) => {
    const response = await axios.post(
      "http://localhost:5555/auth/populateUser",
      {
        accessToken,
      }
    );
    return response.data;
  }
);

export const guestLogin = createAsyncThunk(
  "auth/guestLogin",
  async ({ username }) => {
    try {
      const response = await axios.post("http://localhost:5555/auth/guest", {
        username: username,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }) => {
    const response = await axios.post("http://localhost:5555/auth/login", {
      email: email,
      password: password,
    });
    return response.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }) => {
    const response = await axios.post("http://localhost:5555/auth/register", {
      username: username,
      email: email,
      password: password,
    });
    return response.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    accessToken: null,
    isAuthenticating: false,
    errors: null,
    isPopulating: false,
  },
  reducers: {
    GuestLogout: (state, action) => {
      state.user = {};
      state.errors = null;
      localStorage.removeItem("accessToken");
      state.accessToken = null;
    },
  },
  extraReducers: {
    [guestLogin.pending]: (state, action) => {
      state.isAuthenticating = true;
    },
    [guestLogin.fulfilled]: (state, action) => {
      const { user, accessToken } = action.payload.data;
      state.user = user;
      state.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
      state.isAuthenticating = false;
    },
    [guestLogin.rejected]: (state, action) => {
      state.errors = action.error.message;
      state.isAuthenticating = false;
    },

    [register.pending]: (state, action) => {
      state.isAuthenticating = true;
    },
    [register.fulfilled]: (state, action) => {
      const { user, accessToken } = action.payload.data;
      state.user = user;
      state.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
      state.isAuthenticating = false;
    },
    [register.rejected]: (state, action) => {
      state.errors = action.error.message;
      state.isAuthenticating = false;
    },

    [populateUser.pending]: (state, action) => {
      state.isPopulating = true;
    },
    [populateUser.fulfilled]: (state, action) => {
      state.isPopulating = false;
      const { user } = action.payload.data;
      state.user = user;
    },
    [populateUser.rejected]: (state, action) => {
      state.isPopulating = false;
      state.errors = action.error.message;
      localStorage.removeItem("accessToken");
    },

    [userLogin.pending]: (state, action) => {
      state.isAuthenticating = true;
    },
    [userLogin.fulfilled]: (state, action) => {
      const { user, accessToken } = action.payload.data;
      state.user = user;
      state.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
      state.isAuthenticating = false;
    },
    [userLogin.rejected]: (state, action) => {
      state.errors = action.error.message;
      state.isAuthenticating = false;
    },
  },
});

export const { GuestLogout } = authSlice.actions;

export const getUser = (state) => state.auth.user;
export const getError = (state) => state.auth.errors;

export default authSlice.reducer;
