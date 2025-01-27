"use client";

import SignIn from "@/components/SignIn";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="p-4">
      <SignIn />
      {session && <h2>Access: {session.accessToken}</h2>}
      {session && <h2>Refresh: {session.refreshToken}</h2>}
    </div>
  );
}
