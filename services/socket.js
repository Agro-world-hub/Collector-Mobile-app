// socket-service.js
import io from 'socket.io-client';
// Create a singleton socket instance
const socket = io('http://192.168.43.180:3005', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Add some logging to help with debugging
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.log('Connection error:', error);
});

export default socket;