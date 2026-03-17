import { Server } from "socket.io";
import { registerSocketHandlers } from "../app/module/Chat/Chat.socket";
import { socketAuthMiddleware } from "../app/middlewares/auth";


let io: Server;

//socket initialization server
export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // ✅ apply auth middleware
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {

    const userId = socket.data.user.profileId;

    console.log("User connected:", userId);

    // ✅ auto join room (no need frontend join)
    socket.join(userId);

    // all socket events
    registerSocketHandlers(socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });

  });
};

//socket connection io
export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};