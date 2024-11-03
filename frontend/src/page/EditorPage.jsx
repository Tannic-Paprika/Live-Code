import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { initSocket } from "../helper/socket";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { ACTIONS } from "../actions/Action";
import { CircularProgress } from "@mui/material";

const EditorPage = () => {
  const codeSyncRef = useRef(null);
  const langSyncRef = useRef(null);
  const socketRef = useRef(null);
  const { roomIdEncoded, userNameEncoded } = useParams();
  const roomId = atob(roomIdEncoded);
  const userName = atob(userNameEncoded);
  const reactNavigator = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => {
        console.log(err.message);
        toast.error("Connection Error");
        reactNavigator("/");
      });

      socketRef.current.on("connect_failed", (err) => {
        console.log(err.message);
        toast.error("Connection Failed");
        reactNavigator("/");
      });

      socketRef.current.emit(ACTIONS.JOIN, { roomId, userName });
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ userName, userList, socketId }) => {
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            socketId,
            code: codeSyncRef.current
          });
          socketRef.current.emit(ACTIONS.SYNC_LANGUAGE, {
            socketId,
            language: langSyncRef.current
          });
          toast.success(`${userName} joined the room`);
          setUsers(userList);
        }
      );
      socketRef.current.on(ACTIONS.USER_LEFT, (userName) => {
        toast.error(`${userName} left the room`);
        setUsers((prev) => prev.filter((user) => user !== userName));
      });
    };



    init();
    const handleBeforeUnload = (e) => {
      socketRef.current.emit(ACTIONS.LEAVE, { roomId, userName });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the effect
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId, userName, reactNavigator]);
  const handleLeaveRoom = () => {
    socketRef.current.emit(ACTIONS.LEAVE, { roomId, userName });
    reactNavigator("/");
  };
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room id copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy room id");
    }
  };
  if (!userName) return <Navigate to="/" />;
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="left w-[300px] p-4 flex flex-col">
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
        {userName && (
          <div className="connected flex-1">
            <h2 className="text-white text-xl font-bold mt-4">
              Connected Users
            </h2>
            <ul className="mt-2 flex gap-1 flex-wrap">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <li key={index} className="">
                    <Avatar
                      name={user}
                      size="50"
                      round={"14px"}
                      className="mr-2"
                      color={`rgb(${(Math.random() * 255).toFixed(0)}, ${(
                        Math.random() * 255
                      ).toFixed(0)}, ${(Math.random() * 255).toFixed(0)})`}
                    />
                  </li>
                ))
              ) : (
                <CircularProgress color="secondary" />
              )}
            </ul>
          </div>
        )}
        <div className="">
          <button
            className="w-full bg-emerald-500 p-2 mt-4 rounded-lg text-white hover:bg-emerald-600"
            onClick={handleCopyRoomId}
          >
            Copy Room ID
          </button>
          <button
            className="w-full bg-red-500 p-2 mt-4 rounded-lg text-white hover:bg-red-600"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      </div>
      <div className="right flex-1">
        <CodeEditor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeSyncRef.current = code;
          }}
          onLanguageChange={(language) => {
            langSyncRef.current = language;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
