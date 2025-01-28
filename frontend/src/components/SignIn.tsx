"use client";

import { keycloak } from "./KeyCloakContext";
import Message from "./Message";

export default function SignIn() {
  if (keycloak.authenticated) {
    return (
      <>
        <Message />
        <button
          onClick={() => keycloak.logout()}
          className="text-white px-4 py-2 bg-red-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200"
        >
          Sign Out
        </button>
      </>
    );
  }
  return (
    <button
      onClick={() => keycloak.login()}
      className="text-white px-4 py-2 bg-green-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200"
    >
      Sign In
    </button>
  );
}
