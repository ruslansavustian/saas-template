import { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const [activeConnections, setActiveConnections] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const hasConnected = useRef(false);

  const connectSocket = useCallback(() => {
    if (!hasConnected.current) {
      hasConnected.current = true;
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:3001";

      const newSocket = io(wsUrl, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      newSocket.on("connect", () => {
        setIsConnected(true);

        newSocket.emit("getActiveConnections");
      });

      newSocket.on("activeConnections", (count: number) => {
        setActiveConnections(count);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newSocket.on("disconnect", (_reason: string) => {
        setIsConnected(false);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newSocket.on("connect_error", (_error: any) => {
        setIsConnected(false);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newSocket.on("reconnect", (_attemptNumber: number) => {
        setIsConnected(true);
        newSocket.emit("getActiveConnections");
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newSocket.on("reconnect_error", (_error: any) => {});

      setSocket(newSocket);
    } else {
    }
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      hasConnected.current = false;
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        hasConnected.current = false;
      }
    };
  }, [socket]);

  return {
    socket,
    activeConnections,
    isConnected,
    connectSocket,
    disconnectSocket,
  };
};
