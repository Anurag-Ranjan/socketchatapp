import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ["http://localhost:5173"] },
});

export function getRecieverSocketId(userId) {
  //3:53:33
  return userSocketMap[userId];
}

const userSocketMap = {}; //{userId: socketId} THis is for the online users

io.on("connection", (socket) => {
  //socket is the user that has connected
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  //Used to send an event to every user that has connected
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
