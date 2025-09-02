import {useEffect, useCallback, useContext} from 'react';
import SocketContext from '@/context/SocketContext';

export const useManualSocket = (event, responseHandler) => {
  const {socket, connected, error} = useContext(SocketContext);
  const reconnect = useCallback(() => {
    // eslint-disable-next-line no-console
    socket && socket.disconnected && console.log('reconnecting')
    socket && socket.disconnected && socket.connect()
  }, [socket])

  const subscribe = useCallback(
    () => {
      reconnect()
      // eslint-disable-next-line no-console
      socket && responseHandler && console.log('subscribing to', event)
      socket && responseHandler && socket.on(event, responseHandler)
    },
    [event, responseHandler, socket, reconnect],
  )

  const unsubscribe = useCallback(
    () => {
      // eslint-disable-next-line no-console
      socket && console.log('unsubscribing from', event);
      socket && socket.off(event, responseHandler)
    },
    [event, responseHandler, socket],
  )

  const emit = useCallback((payload) => {
    reconnect()
    socket?.emit(event, payload);
  }, [socket, event, reconnect]);

  return {
    subscribe,
    unsubscribe,
    emit,
    socket,
    connected,
    error,
  }
};

const useSocket = (event, responseHandler) => {
  const {subscribe, unsubscribe, emit, connected, error} = useManualSocket(event, responseHandler)

  useEffect(() => {
    subscribe()
    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe]);

  return {
    emit,
    connected,
    error,
  }
};

export default useSocket;
