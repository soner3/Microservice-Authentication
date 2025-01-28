"use client";

import { useGetMessageQuery } from "@/lib/features/api/apiSlice";

export default function Message() {
  const { data: messageDto, isError } = useGetMessageQuery();

  return (
    <>
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
      <button className="text-white px-4 py-2 bg-blue-600 rounded-md shadow-md m-2 transition-all hover:scale-105 active:scale-95 duration-200">
        Get Message
      </button>
    </>
  );
}
