import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();
const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

export const getRoomId = (senderId, receiverId) => {
  return [senderId.toString(), receiverId.toString()].sort().join("_");
};

const userSocketMap = new Map();

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId?.toString());
};

io.use((socket, next) => {
  const userId =
    socket.handshake.auth?.token || socket.handshake.headers?.userid;
  if (!userId) {
    return next(new Error("Authentication error: Missing User ID"));
  }
  socket.userId = userId.toString();
  next();
});

io.on("connection", (socket) => {
  userSocketMap.set(socket.userId, socket.id);
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("join-chat", (receiverId) => {
    if (receiverId) {
      const roomId = getRoomId(socket.userId, receiverId);
      socket.join(roomId);
    }
  });

  socket.on("disconnect", () => {
    userSocketMap.delete(socket.userId);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { app, server };
