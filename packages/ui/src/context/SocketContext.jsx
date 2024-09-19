import { createContext } from 'react';

const SocketContext = createContext({
  socket: null,
  createSocket: () => {},
  disconnectSocket: () => {},
});

export default SocketContext;
