import React from "react";

const User = ({ user, onBack, onRemove }) => {
  const [ID, setID] = React.useState(user.id);
  const [name, setName] = React.useState(user.name);
  const [phone, setPhone] = React.useState(user.phone || "");
  const [email, setEmail] = React.useState(user.email || "");
 
  const upadateUser = () => { 
    if (name.trim() === "") return;
    alert(`User updated:\nID: ${ID}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`);
    onAdd(name, user.profile, phone, email); // Pass all details
  };  
  
  return (
    <div className="w-1/2 mx-auto px-23">
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between">
            {/* 🔄 Update Button */}
          <button 
          onClick={upadateUser}
          className="mt-4 p-2 bg-blue-500 text-white rounded">
            Update User
          </button>
           {/* 🔙 Back Button */}
          <button 
          onClick={onBack}
           className="mt-4 p-2 bg-gray-700 text-white rounded">
            ⬅ Back
          </button>

        </div>
      
      {/* 👤 Profile */}
      <div className="flex flex-col items-center">
        <img
          src={user.profile}
          alt=""
          className="w-55 h-55 rounded-full mt-6"
        />
        <div className="mt-12 gap-8 flex">     
           <input
            type="number"
            defaultValue={user.id}
            onChange={(e) => setID(e.target.value)}
            />
           <input
            type="text"
            defaultValue={user.name}
            onChange={(e) => setName(e.target.value)}
             />
        </div>
        <div className="gap-8 mt-4 flex">     
          <input 
          type="tel"
           defaultValue={user.phone}
           onChange={(e) => setPhone(e.target.value)}
           />
           <input 
           type="email" 
           defaultValue={user.email} 
           onChange={(e) => setEmail(e.target.value)}
            />
        </div>
      </div>

      {/* ⚙️ More Options */}
      <div className="mt-6 space-y-2">
        <button
         className="w-full p-2 bg-gray-700 rounded"
         onClick={() => alert("Edit profile coming soon!")}>
          Edit Profile
        </button>
        
        <button 
        className="w-full p-2 bg-red-500 rounded"
        onClick={onRemove}>
          Delete User
        </button>
      </div>
    </div>
    </div>
  );
};

export default User;