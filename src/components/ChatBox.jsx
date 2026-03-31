import React, { useState,useEffect} from "react";
import User from "./User";

const ChatBox = ({ user, showDetails, setShowDetails,onRemove,onAdd}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});

const [confirmDelete, setconfirmDelete] = useState(false);


  // ✅ LOAD messages from localStorage (on first load)
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // ✅ SAVE messages to localStorage (every change)
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // ✅ Safe access
  const userMessages = user ? messages[user.id] || [] : [];

  const getBotReply = (msg) => {
  msg = msg.toLowerCase().trim();

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const responses = {
    greeting: [
      "Hey! 👋",
      "Hello there 😊",
      "Hi! How can I help you?",
      "Hey buddy 😄"
    ],
    howAreYou: [
      "I'm doing great 😄 What about you?",
      "All good here! 🚀",
      "Feeling awesome 🤖"
    ],
    thanks: [
      "You're welcome 🙌",
      "No problem 😄",
      "Anytime 👍"
    ],
    bye: [
      "Goodbye 👋",
      "See you later 😄",
      "Take care ❤️"
    ],
    help: [
      "I can help with time, date, jokes, and basic chat 😄",
      "Try asking me things like 'time', 'joke', or 'hello'"
    ],
    jokes: [
      "Why do programmers hate bugs? 🐛 Because they can't debug life 😂",
      "I told my computer a joke… it froze 😅",
      "Why was the JavaScript developer sad? Because he didn’t Node how to Express himself 😆"
    ]
  };

  // conditions
  if (/(hi|hello|hey)/.test(msg)) {
    return getRandom(responses.greeting);
  }

  if (msg.includes("how are you")) {
    return getRandom(responses.howAreYou);
  }

  if (msg.includes("your name")) {
    return "I'm your smart assistant 🤖";
  }

  if (msg.includes("time")) {
    return `⏰ ${new Date().toLocaleTimeString()}`;
  }

  if (msg.includes("date")) {
    return `📅 ${new Date().toLocaleDateString()}`;
  }

  if (msg.includes("help")) {
    return getRandom(responses.help);
  }

  if (/(thank|thanks)/.test(msg)) {
    return getRandom(responses.thanks);
  }

  if (/(bye|goodbye|see you)/.test(msg)) {
    return getRandom(responses.bye);
  }

  if (msg.includes("joke")) {
    return getRandom(responses.jokes);
  }

  // 🔥 simple math (bonus)
  try {
    if (/^[0-9+\-*/(). ]+$/.test(msg)) {
      const result = eval(msg);
      return `🧮 Result: ${result}`;
    }
  } catch (e) {}

  // 🔥 smart fallback
  if (msg.length < 3) {
    return "Can you say a bit more? 🤔";
  }

  return "Hmm 🤔 I didn’t understand that. Try asking something else!";
};

  const sendMessage = () => {
    if (!message.trim() || !user) return;

    const newMsg = {
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString()
    };

    // ✅ Add user message
    setMessages((prev) => ({
      ...prev,
      [user.id]: [...(prev[user.id] || []), newMsg]
    }));

    // 🤖 BOT REPLY (FIXED)
    if (user.isBot) {
      setTimeout(() => {
        const botReply = {
          text: getBotReply(message),
          sender: "other",
          time: new Date().toLocaleTimeString()
        };
        
        setMessages((prev) => ({
          ...prev,
          [user.id]: [...(prev[user.id] || []), botReply]
        }));
      }, 1000);
    }

    setMessage("");
  };

  // ✅ No user selected
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h2>Select a user</h2>
      </div>
    );
  }

  // 👤 USER DETAILS
  if (showDetails) {
    return <User user={user} onAdd={onAdd} onRemove={() => onRemove(user.id)} onBack={() => setShowDetails(false)} />;
  }
  const deleteChat = () => {
  if (!user) return;

    const confirmDelete = window.confirm(
    `Delete chat with ${user.name}?`
  );

    setconfirmDelete(true);
    setTimeout(() => { setconfirmDelete(false) }, 3000)
  if (!confirmDelete) return;

  setMessages((prev) => {
    const updated = { ...prev };
    delete updated[user.id];
    return updated;
  });
};

const handleCamera = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setPreview(url);
};
  return (
    <div className="flex flex-col flex-1 h-screen bg-[#1e1e1e]">
    {confirmDelete && (
         <div className=" top-5 right-5
        bg-red-500 text-white}
          px-6 py-3
          rounded-lg
          shadow-lg
          animate-bounce
          transition-all
          absolute
      ">
          Chat deleted successfully!
      </div>
      )}
     <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-[#2a2a2a]">

  {/* 👤 User Info */}
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

  {/* 🗑 Delete Button */}
  <button
    onClick={deleteChat}
    className="text-red-400 hover:text-red-500 hover:bg-gray-700 text-xl p-2 rounded"
  >
    🗑
  </button>
</div>
      {/* 💬 CHAT */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {userMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[65%] px-3 py-2 rounded-2xl text-sm shadow
                ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-gray-700 text-gray-200 rounded-bl-sm"
                }`}
            >
              {msg.text}
              <div className="text-[10px] opacity-70 mt-1 text-right">
                <span className="mr-2">{msg.sender === "me" ? "You" : user.name}</span> <span>{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔽 INPUT */}
      <div className="p-3 border-t border-gray-700 bg-[#2a2a2a] flex items-center gap-2">
        <button className="text-xl"><label>
         📎
        <input
         type="file"
         accept="image/*"
         hidden
        />
        </label>
        </button>
        <label className="text-xl cursor-pointer">
        📷
        <input
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={handleCamera}
        />
       </label>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-[#3a3a3a] outline-none text-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;