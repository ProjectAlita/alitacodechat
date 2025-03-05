/* eslint-disable no-console */
import { useCallback, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import SocketContext from "./SocketContext";
import DataContext from "./DataContext";

export function SocketProvider({ children }) {
  const { providerConfig } = useContext(DataContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const createSocket = useCallback(() => {
    if (!providerConfig || !providerConfig.socketHost) return;
    const { socketHost, socketPath, token } = providerConfig

    const socketIo = io(socketHost.replace('ws://', 'http://').replace('wss://', 'https://'), {
      transports: ["polling"],
      path: socketPath,
      reconnectionDelayMax: 2000,
      extraHeaders: {'Authorization': `Bearer ${token}`}
    })

    socketIo.on('connect', () => {
      console.log('sio connected', socketIo)
      setConnected(socketIo.connected)
      setError(null)
    })
    socketIo?.on("connect_error", (err) => {
      console.log(`Connection error due to ${err}`);
      setConnected(socketIo.connected)
      setError(`Socket connection error: ${err}`)
    });
    socketIo?.on('disconnect', () => {
      console.log('needs reconnecting', socketIo)
      setConnected(socketIo.connected)
    })

    return socketIo
  }, [providerConfig]);

  useEffect(() => {
    console.log('create socket with providerConfig', providerConfig)

    if (providerConfig) {
      const socketIo = createSocket()
      setSocket(socketIo)

      return () => {
        if (socketIo) {
          console.log('disconnect socket')
          socketIo.disconnect()
        }
      };
    }
  }, [createSocket, providerConfig]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        createSocket,
        connected,
        error,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
