import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [userName, setUserName] = useState("");
    const handleJoinRoom = () => {
        if (!roomId) {
            toast.error("Room ID is required");
            return;
        }
        if (!userName) {
            toast.error("User name is required");
            return;
        }
        navigate(`/editor/${btoa(roomId)}/${btoa(userName)}`, { state: { userName } });
    };
    const handleCreateRoomId = () => {
        const id = uuid();
        setRoomId(id);
        toast.success("Room created successfully");
    }
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="md:w-1/3 w-4/5 bg-[#383A44] rounded-lg p-4">
        <div className="img-container flex gap-2 items-center -ml-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
            ></path>
          </svg>
          <h2 className="text-3xl font-bold text-white">Live Code</h2>
        </div>
        <p className="text-white mt-2">Live Code is a real-time code editor for pair programming.</p>
        <input type="text" className="w-full bg-[#2D2F37] p-2 mt-4 rounded-lg text-white" placeholder="Enter Room ID" value={roomId} onChange={(e)=>setRoomId(e.target.value)}/>
        <input type="text" className="w-full bg-[#2D2F37] p-2 mt-4 rounded-lg text-white" placeholder="Enter Your Name" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
        <button className="w-full bg-emerald-500 p-2 mt-4 rounded-lg text-white hover:bg-emerald-600" onClick={handleJoinRoom}>Join Room</button>
        <p onClick={handleCreateRoomId} className="underline text-sm mt-4 text-white cursor-pointer">Create Room</p>
      </div>
    </div>
  );
};

//next encode the id of the room and the name of the user in the url

export default Home;
