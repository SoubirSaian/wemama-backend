import { Socket } from "socket.io";


export const emitError = ( socket: Socket, statusCode = 500, message = "Internal sever error", disconnect: any ) => {
  socket.emit("socket_error", { status: statusCode, message });

  if (disconnect) {
    socket.disconnect(true);
    console.log("disconnected because of error");
  }

  throw new Error(message);
};

