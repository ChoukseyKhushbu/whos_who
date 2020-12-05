import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI,
  registerAPI,
  populateUserAPI,
  guestAPI,
} from "../../../API/auth";

export const populateUser = createAsyncThunk("auth/populateUser", async () => {
  const response = await populateUserAPI();
  return response.data;
});

export const guestLogin = createAsyncThunk(
  "auth/guestLogin",
  async ({ username }) => {
    const response = await guestAPI({ username });
    return response.data;
  }
);

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }) => {
    const response = await loginAPI({ email, password });
    return response.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }) => {
    const response = await registerAPI({ username, email, password });
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
  },
  reducers: {
    logout: (state, action) => {
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

    [populateUser.pending]: (state, action) => {},
    [populateUser.fulfilled]: (state, action) => {
      const { user, accessToken } = action.payload.data;
      state.user = user;
      state.accessToken = accessToken;
      console.log({ accessToken });
    },
    [populateUser.rejected]: (state, action) => {
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

export const { logout } = authSlice.actions;

export const getUser = (state) => state.auth.user;
export const getAccessToken = (state) => state.auth.accessToken;
export const getError = (state) => state.auth.errors;

export default authSlice.reducer;
