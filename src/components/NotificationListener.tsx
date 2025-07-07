import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const NotificationListener = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log("❌ No socket instance yet.");
      return;
    }

    console.log("✅ Socket ready, setting up listener");

    const handleCancel = (data: any) => {
      console.log("📨 Received subscription_cancelled:", data);
      toast.success(`❌ Subscription cancelled: ${data.subscriptionId}`);
    };

    socket.on("subscription_cancelled", handleCancel);

    return () => {
      socket.off("subscription_cancelled", handleCancel);
    };
  }, [socket]);

  return null;
};

export default NotificationListener;
