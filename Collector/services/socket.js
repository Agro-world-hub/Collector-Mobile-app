import { Platform } from "react-native";
import { io } from "socket.io-client";
export const socket = io("http://192.168.1.13:3005/", {
  transports: ['websocket'], // Ensure WebSocket is used for better performance
  reconnectionAttempts: 5, // Number of reconnection attempts before it stops
  timeout: 10000, // Connection timeout
});

socket.on('connect', () => {
  console.log('Socket connected: ' + socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.log('Socket connection error:', error);
});

export default socket;
