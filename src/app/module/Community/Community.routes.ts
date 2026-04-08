import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import CommunityValidations from "./Community.validation";
import CommunityController from "./Community.controller";
import { uploadProfile } from "../../middlewares/multerMiddleware";


const CommunityRouter = express.Router();

CommunityRouter.post("/create-community",
    authorizeUser,
     uploadProfile.single("community-image"),
    validateRequest(CommunityValidations.createCommunity),
    CommunityController.createCommunity
);

CommunityRouter.post("/join-community",
    authorizeUser,
    CommunityController.joinCommunity
);

CommunityRouter.patch("/edit-community",
    authorizeUser,
    uploadProfile.single("community-image"),
    CommunityController.editCommunity
);

CommunityRouter.get("/get-my-community",
    authorizeUser,
    CommunityController.getMyCommunity
);

CommunityRouter.get("/get-joined-community",
    authorizeUser,
    CommunityController.getAllJoinedCommunity
);

CommunityRouter.get("/get-community-detail/:id",
    authorizeUser,
    CommunityController.getSingleCommunity
);

CommunityRouter.get("/search-community",
    authorizeUser,
    CommunityController.searchCommunity
);

CommunityRouter.get("/get-community-suggestion",
    authorizeUser,
    CommunityController.communitySuggestion
);

//dashboard

CommunityRouter.post("/approve-community",
    // authorizeUser,
    CommunityController.approveCommunity
);

CommunityRouter.delete("/delete-community",
    // authorizeUser,
    CommunityController.deleteCommunity
);



export default CommunityRouter;