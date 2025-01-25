"use client";

import { useLazyGetMessageQuery } from "@/lib/features/api/apiSlice";

export default function Home() {
  const [fetchMessage, { data: messageDto, isError, isLoading }] =
    useLazyGetMessageQuery();
  function handleClick() {
    fetchMessage();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {messageDto
          ? `Message: ${messageDto.message}`
          : "Click the button to fetch a message"}
      </h1>

      {isError && (
        <p className="text-red-500 mb-4">
          {"Something went wrong. Please try again."}
        </p>
      )}

      <button
        onClick={handleClick}
        className="text-white px-4 py-2 bg-blue-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Fetch Message"}
      </button>
    </div>
  );
}
