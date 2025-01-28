import { MessageDto } from "@/app/interfaces";
import { keycloak } from "@/components/KeyCloakContext";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const mutex = new Mutex();
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  credentials: "include",

  prepareHeaders: async (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${keycloak.token}`);
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

      try {
        const refreshed = await keycloak.updateToken();
        console.log("Refreshed Status" + refreshed);
        if (refreshed) {
          console.log("Refresh Successfull");

          result = await baseQuery(args, api, extraOptions);
        } else {
          keycloak.logout();
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
