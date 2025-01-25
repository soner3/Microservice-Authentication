"use client";

import { useState } from "react";

interface MessageDto {
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setIsError(false);
    const response: MessageDto | null = await fetchMessage();
    setIsLoading(false);
    if (response) {
      setMessage(response.message);
    } else {
      setIsError(true);
      setMessage("Unexpected error occurred.");
    }
  }

  return (
    <>
      <h1
        className={`text-xl font-bold ${
          isError ? "text-red-500" : "text-black"
        }`}
      >
        {isLoading ? "Loading..." : `Message: ${message}`}
      </h1>

      <button
        onClick={handleClick}
        className="text-white px-4 py-2 bg-blue-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Message"}
      </button>
    </>
  );
}

async function fetchMessage() {
  try {
    const res = await fetch("http://localhost:8080/app/message", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      const data: MessageDto = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return null;
  }
}
