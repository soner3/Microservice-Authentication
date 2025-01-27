import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RefreshResponseDto } from "../refreshTokenObjects";

export interface TokenState {
  accessToken: string;
  refreshToken: string;
}

const initialState: TokenState = {
  accessToken: "",
  refreshToken: "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    processRefreshResponseDto: (
      state,
      action: PayloadAction<RefreshResponseDto>
    ) => {
      console.log("new refresh: " + action.payload.refresh_token);
      state.refreshToken = action.payload.refresh_token;
      state.accessToken = action.payload.access_token;
    },
  },
});

export const { setToken, processRefreshResponseDto, setAccessToken } =
  tokenSlice.actions;
export default tokenSlice.reducer;
