'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { isAuthenticated } from '../../utils/auth';

const SocketContext = createContext({
  socket: null,
  isConnected: false
});

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated()) {
      // Initialize socket connection
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
        transports: ['websocket'],
        reconnection: true
      });

      socketInstance.on('connect', () => {
        console.log('Socket.io connected:', socketInstance.id);
        setIsConnected(true);

        // Get user info from localStorage to join relevant rooms
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            
            // Join user-specific room
            socketInstance.emit('joinUser', user._id);
            
            // Join hostel-specific room if linked
            if (user.hostelId) {
              socketInstance.emit('joinHostel', user.hostelId);
            }
          } catch (e) {
            console.error('Failed to parse user for socket join:', e);
          }
        }
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket.io disconnected');
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
