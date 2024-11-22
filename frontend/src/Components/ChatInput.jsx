import React from "react";

const ChatInput = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-gray-900 p-4 flex items-center"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow bg-gray-700 text-white p-3 rounded-lg focus:outline-none mr-4"
        placeholder="Type a message..."
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
