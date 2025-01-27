import { RootState } from "@/lib/store";
import { MessageDto } from "@/app/interfaces";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { RefreshResponseDto } from "@/lib/refreshTokenObjects";
import { processRefreshResponseDto } from "../tokenSlice";

const mutex = new Mutex();
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const accessToken = (getState() as RootState).tokenReducer.accessToken;
    headers.set("Content-Type", "application/json");
    if (endpoint !== "/api/auth/refresh") {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const state = api.getState() as RootState;
      const token = JSON.stringify(state.tokenReducer.refreshToken);

      try {
        const refreshResult = await baseQuery(
          {
            url: "/api/auth/refresh",
            method: "POST",
            mode: "no-cors",
            credentials: "include",
            body: token,
          },
          api,
          extraOptions
        );

        if (refreshResult.meta?.response?.ok) {
          api.dispatch(
            processRefreshResponseDto(refreshResult.data as RefreshResponseDto)
          );
          console.log("Refresh Successfull");

          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log("Refresh Failed");
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMessage: builder.query<MessageDto, void>({
      query: () => "/app/message",
    }),
  }),
});

export const { useLazyGetMessageQuery, useGetMessageQuery } = apiSlice;
