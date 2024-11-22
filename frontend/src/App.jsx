import React, {lazy, Suspense} from "react";

const Sidebar = lazy(() => import("./Components/Sidebar"));
const MessageList = lazy(() => import("./Components/MessageList"));
const ChatInput = lazy(() => import("./Components/ChatInput"));


import './App.css'

function App() {

  return (
    <Suspense fallback={<div> loading....</div>} > 
    <div className="app">
      
      hello
    </div>
    </Suspense>
  )
}

export default App
