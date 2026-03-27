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

  // SEnd notification
  // socket.on("new_notification", async (data) => {

  //   const { senderId, receiverId, text } = data;

  //   const message = await ChatService.sendMessage(senderId, receiverId, text);

  //   // socket.emit("message_sent", message);

  // });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {

    const { senderId, receiverId, text } = data;

    const message = await ChatService.sendMessage(senderId, receiverId, text);

    // socket.emit("message_sent", message);

  });

  // GET CHAT LIST
  socket.on("get_chat_list", async (data) => {

    // const { userId } = data;
    const userId = socket.data.user.profileId

    const chats = await ChatService.getChatList(userId);

    socket.emit("chat_list", chats);

  });

  // GET MESSAGES
  socket.on("get_messages", async (data) => {

    const { conversationId } = data;

    const messages = await ChatService.getMessages(conversationId);

    socket.emit("messages", messages);

  });

  // SEARCH USER
  // socket.on("search_user", async (search) => {

  //   const users = await ChatService.searchUsers(search);

  //   socket.emit("search_result", users);

  // });

  //send conversation request
  socket.on("send_conversation_request", async (data) => {

    const { receiverId } = data;
    const senderId = socket.data.user.profileId

    const conversation = await ChatService.sendConversationRequest(
      senderId,
      receiverId
    );

    // console.log(conversation);

  });

  //get all conversation
  socket.on("get_conversation_requests", async () => {

    const userId = socket.data.user.profileId
    
    const requests = await ChatService.getConversationRequests(userId);

    // console.log(requests);
    // socket.emit("conversation_requests", requests);

  });

  //accept request
  socket.on("accept_conversation_request", async (data) => {

    const { conversationId } = data;

    const conversation = await ChatService.acceptConversationRequest(
      conversationId
    );

  });

  //accept request
  socket.on("reject_conversation_request", async (data) => {

    const { conversationId } = data;

    const conversation = await ChatService.rejectConversationRequest(
      conversationId
    );

    // console.log(conversation);

  });

};
