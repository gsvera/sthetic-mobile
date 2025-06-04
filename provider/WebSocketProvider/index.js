import { useApiProvider } from "../InterceptorProvider";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "@/provider/ws/socketService";
import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const { token } = useApiProvider();
  const [channels, setChannels] = useState([]);

  function subscribeToChannel(channel) {
    setChannels((prev) => [...prev, channel]);
  }

  function unSubscribeToChannelByTopic(topic) {
    setChannels((prev) => {
      const arrFilter = prev?.filter((item) => item?.topic !== topic);
      return arrFilter;
    });
  }

  useEffect(() => {
    if (token && channels.length > 0) {
      for (let i = 0; i < channels.length; i++) {
        connectWebSocket(token, channels[i]?.topic, channels[i]?.handleEvent);
        return () => {
          disconnectWebSocket();
        };
      }
    }
  }, [token, channels]);

  return (
    <WebSocketContext.Provider
      value={{
        subscribeToChannel,
        unSubscribeToChannelByTopic,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketProvider = () => {
  return useContext(WebSocketContext);
};

export { WebSocketProvider, useWebSocketProvider };
