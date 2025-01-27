"use client";

import { setAccessToken, setToken } from "@/lib/features/tokenSlice";
import { useAppDispatch } from "@/lib/hooks";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RefreshService() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAccessToken(""));
  }, [dispatch]);

  if (session) {
    dispatch(
      setToken({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
    );

    console.log("Saved  Token");
  }

  return <></>;
}
