import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const NotificationListener = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log("❌ No socket");
      return;
    }

    socket.on("subscription_cancelled", (data) => {
      console.log("❌ Subscription cancelled:", data);
      toast.success("❌ Subscription cancelled:", data);
    });

    return () => {
      socket.off("subscription_cancelled");
    };
  }, [socket]);

  return null;
};

export default NotificationListener;
