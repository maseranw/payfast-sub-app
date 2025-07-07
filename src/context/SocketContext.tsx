import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
      {
        withCredentials: true,
      }
    );

    // Listen for connection event
    socketIo.on("connect", () => {
      console.log("✅ Socket connected:", socketIo.id);
    });

    // Listen for connection error event
    socketIo.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    // Listen for disconnect event
    socketIo.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
