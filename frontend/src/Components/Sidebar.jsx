import React from "react";

const Sidebar = ({ uniqueTitles, onCreateNewChat, onChatSelect }) => {
  return (
    <div className="w-64 bg-gray-900 p-4 flex flex-col">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600"
        onClick={onCreateNewChat}
      >
        New Chat
      </button>
      <ul className="space-y-2">
        {uniqueTitles.map((title, index) => (
          <li
            key={index}            
            className="cursor-pointer text-gray-300 hover:bg-gray-700 py-2 px-3 rounded"
            onClick={() => onChatSelect(title)}
          >
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;