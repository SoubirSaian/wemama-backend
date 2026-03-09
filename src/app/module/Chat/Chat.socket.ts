// import catchAsync from "../../../utilities/catchasync";
// import sendResponse from "../../../utilities/sendResponse";
// import { sendMessage } from "./Chat.service";
// // import ChatServices from "./Chat.service";

// const sendMessageController = catchAsync(async (req, res) => {

//     const senderId = req.user.profileId;
//     const { receiverId, text } = req.body;

//     const message = await sendMessage(senderId, receiverId, text);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Message sent successfully.",
//         data: message,
//     });
// });

import { Socket } from "socket.io";
import * as ChatService from "./Chat.service";

export const registerSocketHandlers = (socket: Socket) => {

  // SEND MESSAGE
  socket.on("send_message", async (data) => {

    const { senderId, receiverId, text } = data;

    const message = await ChatService.sendMessage(senderId, receiverId, text);

    socket.emit("message_sent", message);

  });

  // GET CHAT LIST
  socket.on("get_chat_list", async (userId) => {

    const chats = await ChatService.getChatList(userId);

    socket.emit("chat_list", chats);

  });

  // GET MESSAGES
  socket.on("get_messages", async (conversationId) => {

    const messages = await ChatService.getMessages(conversationId);

    socket.emit("messages", messages);

  });

  // SEARCH USER
  socket.on("search_user", async (search) => {

    const users = await ChatService.searchUsers(search);

    socket.emit("search_result", users);

  });

  //send conversation request
  socket.on("send_conversation_request", async (data) => {

    const { senderId, receiverId } = data;

    const conversation = await ChatService.sendConversationRequest(
      senderId,
      receiverId
    );

  });

  //get all conversation
  socket.on("get_conversation_requests", async (userId) => {

    const requests = await ChatService.getConversationRequests(userId);

    socket.emit("conversation_requests", requests);

  });

//accept request
socket.on("accept_conversation_request", async (conversationId) => {

  const conversation = await ChatService.acceptConversationRequest(
    conversationId
  );

});

};
