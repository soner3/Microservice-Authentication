"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Message from "./Message";

export default function SignIn() {
  const { data: session } = useSession();

  return (
    <div>
      {!session && (
        <button
          className="text-white px-4 py-2 bg-green-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200"
          onClick={() => signIn("keycloak")}
        >
          Sign In
        </button>
      )}
      {session && (
        <>
          <Message />
          <button
            className="text-white px-4 py-2 bg-red-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}
