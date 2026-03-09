import { Server } from "socket.io";
import { registerSocketHandlers } from "../app/module/Chat/Chat.socket";

let io: Server;

//socket initialization server
export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join", (userId: string) => {
      socket.join(userId);
    });

    //all socket event
    registerSocketHandlers(socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

//soxket connection io
export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};