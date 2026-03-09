import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import CommunityValidations from "./Community.validation";
import CommunityController from "./Community.controller";


const CommunityRouter = express.Router();

CommunityRouter.post("/create-community",
    authorizeUser,
    validateRequest(CommunityValidations.createCommunity),
    CommunityController.createCommunity
);



export default CommunityRouter;