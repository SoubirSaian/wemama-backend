import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import CommunityValidations from "./Community.validation";
import CommunityController from "./Community.controller";
import { uploadProfile } from "../../middlewares/multerMiddleware";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";


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

CommunityRouter.get("/get-all-community",
    // authorizeUser,
    CommunityController.getALLCommunity
);

CommunityRouter.get("/get-community-request",
    // authorizeUser,
    CommunityController.getCommunityRequest
);

CommunityRouter.get("/get-single-community/:id",
    // authorizeUser,
    CommunityController.getCommunityDetail
);

CommunityRouter.post("/approve-community/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    CommunityController.approveCommunity
);

CommunityRouter.delete("/delete-community/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    CommunityController.deleteCommunity
);



export default CommunityRouter;