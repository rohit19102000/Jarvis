import React from "react";

const MessageList = ({ messages, onScroll, containerRef, isLoading }) => {
  return (
    <div
      className="flex-grow w-full overflow-y-auto bg-gray-800 p-4"
      onScroll={onScroll}
      ref={containerRef}
    >
      {isLoading && <div className="text-center text-gray-400">Loading...</div>}
      <ul className="space-y-4">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-700 text-gray-300"
            }`}
          >
            {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
