import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, SpotifyUser } from "../../types/spotify";

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; user: SpotifyUser }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    exchangeCodeRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    checkAuthRequest: (state) => {
      state.loading = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  exchangeCodeRequest,
  checkAuthRequest,
} = authSlice.actions;
