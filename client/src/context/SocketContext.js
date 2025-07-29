import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token && user && user._id) {
      const s = io('/', { auth: { token } });
      setSocket(s);
      console.log('Socket connected for user:', user.username, user._id);
      s.on('connect', () => {
        console.log('Socket.IO connected:', s.id);
      });
      return () => {
        s.disconnect();
        setSocket(null);
        console.log('Socket disconnected');
      };
    } else {
      setSocket(null);
    }
  }, [token, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}; 