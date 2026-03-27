import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ChatValidations from "./Chat.validation";
import { searchChat } from "./Chat.controller";



const ChatRouter = express.Router();

ChatRouter.get("/search-chat", 
    authorizeUser,
    searchChat
);



export default ChatRouter;