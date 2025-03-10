/* eslint-disable no-console */
import { useCallback, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import SocketContext from "./SocketContext";
import DataContext from "./DataContext";

export function SocketProvider({ children }) {
  const { providerConfig, postMessageToVsCode } = useContext(DataContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const createSocket = useCallback(() => {
    console.log("IN CREATE SOCKET 1", providerConfig)
    if (!providerConfig || !providerConfig.socketHost) return;
    console.log("IN CREATE SOCKET 2", providerConfig)
    const { socketHost, socketPath, token, ioConfig } = providerConfig
    
    const { ioHost, ...newIOConfig } = ioConfig;

    const socketIo = io(ioConfig.ioHost || socketHost, Object.assign({
      transports: ["polling"],
      rejectUnauthorized: false,
      path: socketPath,
      reconnectionDelayMax: 2000,
      extraHeaders: {'Authorization': `Bearer ${token}`}
    }, newIOConfig))

    socketIo.on('connect', () => {
      console.log('sio connected', socketIo)
      setConnected(socketIo.connected)
      setError(null)
    })
    socketIo?.on("connect_error", (err) => {
      console.log(`Connection error due to ${err}`);
      setConnected(socketIo.connected)
      setError(`Socket connection error: ${err.message} :: ${err.description} :: ${JSON.stringify(err.context)}`)
      // const errorDetails = JSON.stringify((err.message || err.stack) ? { msg: err.message, stack: err.stack } : err);
      // postMessageToVsCode && postMessageToVsCode({ type: VsCodeMessageTypes.error, data: errorDetails });
    });
    socketIo?.on('disconnect', () => {
      console.log('needs reconnecting', socketIo)
      setConnected(socketIo.connected)
    })

    return socketIo
  }, [providerConfig, postMessageToVsCode]);

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
