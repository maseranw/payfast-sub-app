import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();
  const prevUserId = useRef<string | null>(null);

  // Initialize socket connection once
  useEffect(() => {
    const socketIo = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
      withCredentials: true,
    });

    socketIo.on("connect", () => {
      console.log("✅ Socket connected:", socketIo.id);
    });

    socketIo.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    socketIo.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Join/leave user rooms when user changes
  useEffect(() => {
    if (!socket) return;

    // Leave previous room if user changed
    if (prevUserId.current && prevUserId.current !== user?.id) {
      console.log(`⬅️ Leaving room: ${prevUserId.current}`);
      socket.emit("leave_user_room", prevUserId.current);
    }

    if (user?.id) {
      console.log(`➡️ Joining room: ${user.id}`);
      socket.emit("join_user_room", user.id);
      prevUserId.current = user.id;
    } else {
      prevUserId.current = null;
    }
  }, [user, socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
