// import { io } from 'socket.io-client';
// console.log(io);
const socket = io('http://localhost:3001', { autoConnect: false });

const res = confirm('Connect?');

if (res) socket.connect();
