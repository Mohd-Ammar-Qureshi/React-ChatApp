import React, { useState, useEffect, useRef } from "react";
import User from "./User";

const ChatBox = ({ user, showDetails, setShowDetails, onRemove, onAdd }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [preview, setPreview] = useState(null);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  // ✅ LOAD
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ✅ SAVE
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const userMessages = user ? messages[user.id] || [] : [];

  // 🧠 ADVANCED BOT
  const getBotReply = (msg) => {
    msg = msg.toLowerCase().trim();

    const getRandom = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const responses = {
      greeting: ["Hey 👋", "Hello 😊", "Hi there 😄"],
      ai: ["I can help with coding, chatting, jokes & more 🤖"],
      fallback: [
        "Interesting 🤔 tell me more...",
        "I see 👀 can you explain more?",
        "Hmm... let's think about that 🤖",
      ],
    };

    if (/(hi|hello|hey)/.test(msg)) return getRandom(responses.greeting);

    if (msg.includes("your name")) return "I'm your advanced AI bot 🤖";

    if (msg.includes("time"))
      return `⏰ ${new Date().toLocaleTimeString()}`;

    if (msg.includes("date"))
      return `📅 ${new Date().toLocaleDateString()}`;

    if (msg.includes("help")) return getRandom(responses.ai);

    if (msg.includes("joke"))
      return "Why do developers hate bugs? 🐛 Because debugging life is hard 😂";

    // 🧮 SAFE MATH
    try {
      if (/^[0-9+\-*/(). ]+$/.test(msg)) {
        const result = Function(`"use strict"; return (${msg})`)();
        return `🧮 Result: ${result}`;
      }
    } catch {}

    // 🧠 SMART RESPONSE
    if (msg.includes("react"))
      return "React is a JS library for building UI ⚛️";

    if (msg.includes("code"))
      return "Send me your code 👨‍💻 I'll help you fix it!";

    if (msg.length < 3) return "Say something more 🙂";

    return getRandom(responses.fallback);
  };

  const sendMessage = () => {
    if ((!message.trim() && !preview) || !user) return;

    const newMsg = {
      text: message,
      image: preview,
      sender: "me",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => ({
      ...prev,
      [user.id]: [...(prev[user.id] || []), newMsg],
    }));

    setMessage("");
    setPreview(null);

    // 🤖 BOT
    if (user.isBot) {
      setTyping(true);

      setTimeout(() => {
        const botReply = {
          text: getBotReply(message),
          sender: "other",
          time: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => ({
          ...prev,
          [user.id]: [...(prev[user.id] || []), botReply],
        }));

        setTyping(false);
      }, 1200);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h2>Select a user</h2>
      </div>
    );
  }

  if (showDetails) {
    return (
      <User
        user={user}
        onAdd={onAdd}
        onRemove={() => onRemove(user.id)}
        onBack={() => setShowDetails(false)}
      />
    );
  }

  const deleteChat = () => {
    if (!user) return;

    if (!window.confirm(`Delete chat with ${user.name}?`)) return;

    setMessages((prev) => {
      const updated = { ...prev };
      delete updated[user.id];
      return updated;
    });

    setconfirmDelete(true);
    setTimeout(() => setconfirmDelete(false), 2000);
  };

  const handleCamera = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#1e1e1e]">
      
      {/* ✅ DELETE ALERT */}
      {confirmDelete && (
        <div className="absolute top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Chat deleted!
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-[#2a2a2a]">
        <div
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src={user.profile} className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-sm font-semibold">{user.name}</h2>
            <span className="text-xs text-gray-400">online</span>
          </div>
        </div>

        <button
          onClick={deleteChat}
          className="text-red-400 hover:text-red-500 text-xl"
        >
          🗑
        </button>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {userMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[65%] px-3 py-2 rounded-2xl text-sm ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  className="rounded-lg mb-2 max-h-40"
                />
              )}
              {msg.text}
              <div className="text-[10px] opacity-70 mt-1 text-right">
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* 🤖 typing */}
        {typing && (
          <div className="text-gray-400 text-sm">Bot is typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-gray-700 bg-[#2a2a2a] flex gap-2">
        <label className="cursor-pointer">
          📷
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleCamera}
          />
        </label>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-[#3a3a3a] outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;