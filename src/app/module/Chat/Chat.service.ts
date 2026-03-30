import mongoose from "mongoose";
import { ConversationModel, MessageModel } from "./Chat.model";
import { getIO } from "../../../socket/socket.connection";
import ApiError from "../../../error/ApiError";
import UserModel from "../User/User.model";
import notification from "../../../helper/sendNotification";
import { ENUM_NOTIFICATION_TYPE } from "../../../utilities/enum";
import { emitResult } from "../../../socket/emitResult";
import sendResponse from "../../../utilities/sendResponse";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { emitError } from "../../../socket/emitError";

//send request
// export const sendConversationRequest = async (
//   senderId: string,
//   receiverId: string
// ) => {
//   const io = getIO();

//   const existing = await ConversationModel.findOne({
//     participants: { $all: [senderId, receiverId] }
//   });

//   if (existing) {

//     //send response to receiver
//     io.to(receiverId).emit("new_conversation_request", emitResult({
//           statusCode: 201,
//           success: true,
//           message: `You have received a new conversation request`,
//           data: existing,
//         }));
//     //send response to
//     io.to(senderId).emit("new_conversation_request", emitResult({
//           statusCode: 201,
//           success: true,
//           message: `You have requested for a new conversation.`,
//           data: existing,
//         }));

//     return existing
//   };


//   const conversation = await ConversationModel.create({
//     participants: [senderId, receiverId],
//     status: "Pending"
//   });

//   //send response to receiver
//   io.to(receiverId).emit("new_conversation_request", emitResult({
//         statusCode: 201,
//         success: true,
//         message: `You have received a new conversation request`,
//         data: conversation,
//       }));
//   //send response to
//   io.to(senderId).emit("new_conversation_request", emitResult({
//         statusCode: 201,
//         success: true,
//         message: `You have requested for a new conversation .`,
//         data: conversation,
//       }));

//   //send a notification
//   await notification.createNotification({
//       toId: receiverId as string,
//       toModel: "User",
//       title: `An user sent you a conversation request.`,
//       type: ENUM_NOTIFICATION_TYPE.SENT_WAVE,
//       referenceId: conversation?._id,
//       referenceModel: "Conversation"
//   });

//   return conversation;
// };

//get all request
export const getConversationRequests = async (userId: string) => {

  const io = getIO();

  const requests = await ConversationModel.find({
    participants: userId,
    // status: "Pending"
  }).populate("participants", "name profileImage");


  //send response to receiver
  io.to(userId).emit("conversation_requests", emitResult({
        statusCode: 200,
        success: true,
        message: `You have retrieved all conversation requests.`,
        data: requests,
      }));

  return requests;
};

export const sendConversationRequest = async (
  senderId: string,
  receiverId: string
) => {
  const io = getIO();

  // 1️⃣ Check if conversation already exists
  const existing = await ConversationModel.findOne({
    participants: { $all: [senderId, receiverId] }
  });

  const conversation = existing
    ? existing
    : await ConversationModel.create({
        participants: [senderId, receiverId],
        status: "Pending",
      });

  // 2️⃣ Prepare payload
  const payloadForReceiver = emitResult({
    statusCode: 201,
    success: true,
    message: `You have received a new conversation request`,
    data: conversation,
  });

  const payloadForSender = emitResult({
    statusCode: 201,
    success: true,
    message: `You have requested for a new conversation.`,
    data: conversation,
  });

  // 3️⃣ Emit to receiver and sender if connected
  //    Note: io.to(userId).emit() does nothing if user not in room
  const connectedSocketsReceiver = io.sockets.adapter.rooms.get(receiverId);
  const connectedSocketsSender = io.sockets.adapter.rooms.get(senderId);

  if (connectedSocketsReceiver && connectedSocketsReceiver.size > 0) {
    io.to(receiverId).emit("new_conversation_request", payloadForReceiver);
  } else {
    console.warn(`Receiver ${receiverId} not connected yet — event not emitted`);
    // Optional: save to DB queue for delivery on next login
  }

  if (connectedSocketsSender && connectedSocketsSender.size > 0) {
    io.to(senderId).emit("new_conversation_request", payloadForSender);
  } else {
    console.warn(`Sender ${senderId} not connected yet — event not emitted`);
  }

  // 4️⃣ Send persistent notification (DB) regardless of socket connection
  await notification.createNotification({
    toId: receiverId,
    toModel: "User",
    title: `A user sent you a conversation request.`,
    type: ENUM_NOTIFICATION_TYPE.SENT_WAVE,
    referenceId: conversation._id,
    referenceModel: "Conversation",
  });

  return conversation;
};

//accept request
export const acceptConversationRequest = async (conversationId: string) => {

  if (!conversationId) {
    throw new ApiError(400, "Conversation Id is required.");
  }

  const io = getIO();

  // const conversation = await ConversationModel.findByIdAndUpdate(
  //   conversationId,
  //   { status: "Accepted" },
  //   { new: true }
  // );

  const conversation:any = await ConversationModel.findByIdAndUpdate(
    conversationId,
    { status: "Accepted" },
    { new: true }
  )
  .populate("participants", "name profileImage")
  .lean();

  if (!conversation) {
    throw new ApiError(404, "Conversation not found to reject.");
  }


  // conversation?.participants.forEach((userId: string) => {
  //   io.to(userId.toString()).emit("conversation_accepted", emitResult({
  //       statusCode: 200,
  //       success: true,
  //       message: `You have accepted a new conversation request.`,
  //       data: conversation,
  //     }));
  // });

  // ✅ convert to string
  const senderId = conversation.participants[0]._id.toString();
  const receiverId = conversation.participants[1]._id.toString();

  //send response to receiver
  io.to(senderId).emit("conversation_accepted", emitResult({
        statusCode: 200,
        success: true,
        message: `Your new conversation request accepted.`,
        data: conversation,
      }));

  io.to(receiverId).emit("conversation_accepted", emitResult({
        statusCode: 200,
        success: true,
        message: `You have accepted a new conversation request.`,
        data: conversation,
      }));

  //send a notification
  await notification.createNotification({
      toId: senderId as string,
      toModel: "User",
      title: `User accepted your conversation request.`,
      type: ENUM_NOTIFICATION_TYPE.ACCEPT_WAVE,
      referenceId: conversation?._id,
      referenceModel: "Conversation"
  });

  return conversation;
};

//reject a request
export const rejectConversationRequest = async (conversationId: string) => {

  if (!conversationId) {
    throw new ApiError(400, "Conversation Id is required.");
  }

  const io = getIO();

  // const conversation = await ConversationModel.findByIdAndDelete(conversationId);
  
  const conversation: any = await ConversationModel.findByIdAndUpdate(
    conversationId,
    { status: "Rejected" },
    { new: true }
  ).lean();

  if (!conversation) {
    throw new ApiError(404, "Conversation not found to reject.");
  }

  // ✅ convert to string
  const receiverId = conversation.participants[0].toString();
  const senderId = conversation.participants[1].toString();

  // console.log("Sender:", senderId);
  // console.log("Receiver:", receiverId);

  // ✅ emit correctly
  io.to(receiverId).emit("conversation_rejected", emitResult({
    statusCode: 200,
    success: true,
    message: `Your conversation request was declined.`,
    data: conversation,
  }));

  io.to(senderId).emit("conversation_rejected", emitResult({
    statusCode: 200,
    success: true,
    message: `You declined the conversation request.`,
    data: conversation,
  }));

  return conversation;
};

//get chatlist
export const getChatList = async (userId: string) => {
    try {
        
        const chats = await ConversationModel.aggregate([
          {
            $match: {
              participants: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "participants",
              foreignField: "_id",
              as: "users",
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "lastMessage",
              foreignField: "_id",
              as: "lastMessage",
            },
          },
          {
            $unwind: {
              path: "$lastMessage",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              otherUser: {
                $filter: {
                  input: "$users",
                  as: "user",
                  cond: {
                    $ne: ["$$user._id", new mongoose.Types.ObjectId(userId)],
                  },
                },
              },
            },
          },
          {
            $unwind: "$otherUser",
          },
          {
            $sort: {
              updatedAt: -1,
            },
          },
          {
            $project: {
              _id: 1,
              "otherUser.name": 1,
              "otherUser.profileImage": 1,
              lastMessage: "$lastMessage.text",
              time: "$lastMessage.createdAt",
            },
          },
        ]);

        const payloadForReceiver = emitResult({
          statusCode: 200,
          success: true,
          message: `Retrieved all your chat.`,
          data: chats,
        });
      
        return payloadForReceiver;
    } catch (error) {
        console.log(error);
        throw new ApiError(500,"Error in get chat lis.");
    }

};

//get all message from user
export const getMessages = async (conversationId: string) => {

    try {   
        const messages = await MessageModel.find({
          conversationId,
        }).sort({ createdAt: 1 });

        // const payloadForReceiver = emitResult({
        //   statusCode: 200,
        //   success: true,
        //   message: `Retrieved all your chat.`,
        //   data: messages,
        // });
      
        return  emitResult({
          statusCode: 200,
          success: true,
          message: `Retrieved all your chat.`,
          data: messages,
        });
    } catch (error) {
        console.log(error);
        console.log(500,"Error In get all message.");
    }

};

//send new message service function
export const sendMessage = async ( senderId: string,receiverId: string,text: string ) => {

    try {
        const io = getIO();
        
        let conversation = await ConversationModel.findOne({
          participants: { $all: [senderId, receiverId] },
          status: "Accepted"
        });
        
        //create conversation if not available
        if (!conversation) {
          conversation = await ConversationModel.create({
            participants: [senderId, receiverId],
          });
      
          if(!conversation){
              throw new ApiError(500,"Failed to create new conversation.");
          }
      
        }
      
        const message = await MessageModel.create({
          conversationId: conversation._id,
          sender: senderId,
          receiver: receiverId,
          text,
        });
      
        conversation.lastMessage = message._id;
        await conversation.save();
      
        //send message to both user
        io.to(receiverId).emit("new_message", emitResult({
          statusCode: 201,
          success: true,
          message: `You have received a new message.`,
          data: message,
        }));
        // io.to(senderId).emit("new_message", message);
      
        // update chat list
        // const senderChats = await getChatList(senderId);
        // const receiverChats = await getChatList(receiverId);
      
        // io.to(senderId).emit("chat_list", senderChats);
        // io.to(receiverId).emit("chat_list", receiverChats);
      
        return message;
    } catch (error) {
        console.log(error);
        // emitError(
        //   socket,
        //   error?.statusCode || 500,
        //   error?.message || "Send message failed"
        // );
        // throw new ApiError(500,"Send new message error.");
    }

};

//search user by name
export const searchUsers = async (userDetails:IJwtPayload,query: Record<string,unknown>) => {

  const {profileId} = userDetails;
  const {searchText} = query;

 const myProfile = new mongoose.Schema.Types.ObjectId(profileId)

  const chats = await ConversationModel.aggregate([

    // 1️⃣ Only this user's conversations
    {
      $match: {
        participants: myProfile,
        status: "Accepted"
      }
    },

    // 2️⃣ Join users
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "users"
      }
    },

    // 3️⃣ Get other user (exclude self)
    {
      $addFields: {
        otherUser: {
          $filter: {
            input: "$users",
            as: "user",
            cond: {
              $ne: ["$$user._id", myProfile]
            }
          }
        }
      }
    },

    { $unwind: "$otherUser" },

    // 4️⃣ 🔍 Search by name
    {
      $match: {
        "otherUser.name": {
          $regex: searchText,
          $options: "i"
        }
      }
    },

    // 5️⃣ Join last message
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage"
      }
    },

    {
      $unwind: {
        path: "$lastMessage",
        preserveNullAndEmptyArrays: true
      }
    },

    // 6️⃣ Sort latest first
    {
      $sort: {
        updatedAt: -1
      }
    },

    // 7️⃣ Final output
    {
      $project: {
        _id: 1,
        "otherUser._id": 1,
        "otherUser.name": 1,
        "otherUser.profileImage": 1,
        lastMessage: "$lastMessage.text",
        time: "$lastMessage.createdAt"
      }
    }

  ]);

 return chats;
  
};