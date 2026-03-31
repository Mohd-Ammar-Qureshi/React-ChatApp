import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";

const App = () => {
 const [users, setUsers] = useState([
 
  // 🤖 BOT USER
  {
    id: 999,
    name: "ChatBot 🤖",
    profile: "https://i.pravatar.cc/200?img=5",
    isBot: true
  },
   {
    id: 1,
    name: "Mohd Ammar Qureshi",
    profile: "https://i.pravatar.cc/200?img=1",
    phone: "123-456-7890",
    email: "ABC@gmail.com"
  },
  {
    id: 2,
    name: "Ali",
    profile: "https://i.pravatar.cc/200?img=2"
  }
]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false); 

  const [removeuser, setremoveuser] = useState(null);

  // ➕ Add user
  const addUser = (name, profile) => {
  const newUser = {
    id: Date.now(),
    name,
    profile: profile || `https://i.pravatar.cc/200?u=${name}`
  };

  setUsers([...users, newUser]);
};
  // ❌ Remove user
  const removeUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }
    setremoveuser(true)
    setTimeout(() => { setremoveuser(false) }, 3000)
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
        {removeuser && (
         <div className=" top-5 right-5
        bg-red-500 text-white
         px-6 py-3
         rounded-lg
         shadow-lg
         animate-bounce
         transition-all
         absolute
      ">
          User removed successfully!
      </div>
      )}
      <Sidebar
        users={users}
        onSelect={setSelectedUser}
        onAdd={addUser}
        onRemove={removeUser}
      />
      <ChatBox
        user={selectedUser}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        onRemove={removeUser}
      />
    </div>
  );
}
   
export default App;