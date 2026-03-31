import React, { useState } from "react";

const Sidebar = ({ users, onSelect, onAdd, onRemove}) => {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [useradded, setuseradded] = useState(false);
  const handleAdd = () => {
    if (name.trim() === "") return;

    onAdd(name, profile); // send both values
    setuseradded(true)
    setTimeout(() => { setuseradded(false) }, 3000)
    // reset fields
    setName("");
    setProfile("");
    setShowInput(false);
  };

  return (
    <div className=" sidebar w-64 p-4 overflow-y-auto bg-[#2a2a2a]">
      {useradded && (
         <div className=" top-5 right-5
        bg-green-500 text-white}
          px-6 py-3
          rounded-lg
          shadow-lg
          animate-bounce
          transition-all
          absolute
      ">
          User added successfully!
      </div>
      )}
      <h3 className="text-lg font-bold mb-2">@Users</h3>

      {/* Add Button */}
      <button 
        className="bg-blue-500 text-white mb-2 py-1 px-3 rounded hover:bg-blue-400"
        onClick={() => setShowInput(!showInput)}>
        {showInput ? "Cancel" : "+ Add User"}
      </button>

      {/* Input Box */}
      {showInput && (
        <div className="flex flex-col gap-2 my-2"  >
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />

          <input
            type="text"
            placeholder="Enter profile URL (optional)"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button 
           className="bg-green-500 text-white mb-1 py-2 px-4 rounded hover:bg-green-600"
           onClick={handleAdd}>Add User</button>
        </div>
      )}

      {/* User List */}
      {users.map((user) => (
        <div
          className="p-1 mt-4 flex items-center justify-between border border-gray-500 rounded-sm cursor-pointer hover:bg-gray-700"
          key={user.id}
          
        >
          <div
            onClick={() => onSelect(user)}
            className="flex items-center cursor-pointer"
          >
            <img
              src={user.profile || "https://via.placeholder.com/40"}
              alt=""
              width="35"
              height="35"
              className="rounded-full object-cover"
            />
            <span className="ml-2">{user.name}</span>
          </div>

          <button 
           className={`mr-2 text-gray-800 hover:text-red-500 p-2 rounded ${user.isBot ? "hidden" : "block"}`}
           onClick={() => onRemove(user.id)}>✖</button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;