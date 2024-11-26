import React, { useState, useRef, lazy, Suspense, useMemo, useCallback, useEffect } from "react";

const Sidebar = lazy(() => import("./Components/Sidebar"));
const MessageList = lazy(() => import("./Components/MessageList"));
const ChatInput = lazy(() => import("./Components/ChatInput"));

import './App.css'


function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const messageContainerRef = useRef(null);
  const PAGE_SIZE = 10;

  const currentChat = useMemo(
    () => previousChats.find((chat) => chat.title === currentTitle)?.chat || [],
    [previousChats, currentTitle]
  );

  const uniqueTitles = useMemo(
    () => Array.from(new Set(previousChats.map((chat) => chat.title))),
    [previousChats]
  );

  const createNewChat = useCallback(() => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
    setDisplayedMessages([]);
  }, []);

  const handleChatSelect = useCallback((uniqueTitle) => {
    if (uniqueTitle === currentTitle) {
      // If the user clicks on the currently active chat, do nothing
      return;
  }
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
    setPage(1);
    setDisplayedMessages([]);
  }, [currentTitle]);

  const getMessages = async () => {
    if (!value.trim()) return;

    const newMessage = { role: "user", content: value };
    const updatedChat = [...(currentChat || []), newMessage];
    setValue("");

    try {
      const response = await fetch("http://localhost:8000/completions", {
        method: "POST",
        body: JSON.stringify({ messages: updatedChat }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.choices[0].message.content };
      const updatedChatWithAssistant = [...updatedChat, assistantMessage];

      if (currentTitle) {
        setPreviousChats((prevChats) =>
          prevChats.map((chat) =>
            chat.title === currentTitle ? { ...chat, chat: updatedChatWithAssistant } : chat
          )
        );
      } else {
        const newChatTitle = value;
        setCurrentTitle(newChatTitle);
        setPreviousChats((prev) => [
          ...prev,
          { title: newChatTitle, chat: updatedChatWithAssistant },
        ]);
      }

      setMessage(assistantMessage.content);
      setDisplayedMessages(updatedChatWithAssistant.slice(-PAGE_SIZE));
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const loadMoreMessages = useCallback(() => {
    if (isLoading || page * PAGE_SIZE >= currentChat.length) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newMessages = currentChat.slice(
        -PAGE_SIZE * nextPage,
        -PAGE_SIZE * (nextPage - 1)
      );

      setDisplayedMessages((prev) => [...newMessages, ...prev]);
      setPage(nextPage);
      setIsLoading(false);
    }, 500);
  }, [isLoading, page, currentChat]);

  const handleScroll = useCallback(() => {
    if (messageContainerRef.current?.scrollTop === 0) loadMoreMessages();
  }, [loadMoreMessages]);

  useEffect(() => {
    if (currentTitle) {
      setDisplayedMessages(currentChat.slice(-PAGE_SIZE));
    }
  }, [currentTitle, currentChat]);

  return (
    <Suspense fallback={<div className="text-center py-4 text-white">Loading...</div>}>
    <div className="flex h-screen bg-gray-800">
      <Sidebar
        uniqueTitles={uniqueTitles}
        onCreateNewChat={createNewChat}
        onChatSelect={handleChatSelect}
      />
      <div className="flex flex-col flex-grow justify-between items-center text-white">
        {!currentTitle && <h1 className="text-3xl mt-4">Jarvis with react + node.js</h1>}
        <MessageList
          messages={displayedMessages}
          onScroll={handleScroll}
          containerRef={messageContainerRef}
          isLoading={isLoading}
        />
        <ChatInput value={value} onChange={setValue} onSubmit={getMessages} />
      </div>
    </div>
  </Suspense>
  )
}

export default App
