import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ExpertValidations from "./Expert.validation";
import ExpertController from "./Expert.controller";
import { uploadExpertFile, uploadProfile } from "../../middlewares/multerMiddleware";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";
import { checkSessionApproval } from "../../middlewares/permission";


const ExpertRouter = express.Router();
export const AgoraRouter = express.Router();

//agora
AgoraRouter.post("/start-live/:sessionId",
    authorizeUser,
    checkSessionApproval,
    // validateRequest(ExpertValidations.expertRegistrationValidation),
    ExpertController.startAgoraLiveSession
);

AgoraRouter.get("/join-live",
    authorizeUser,
    // validateRequest(ExpertValidations.expertRegistrationValidation),
    ExpertController.joinAgoraLiveSession
);

AgoraRouter.post("/end-live",
    authorizeUser,
    // validateRequest(ExpertValidations.expertRegistrationValidation),
    ExpertController.endAgoraLiveSession
);


//expert
ExpertRouter.post("/expert-register",

    validateRequest(ExpertValidations.expertRegistrationValidation),
    ExpertController.expertRegistration
);

ExpertRouter.post("/expert-login",

    validateRequest(ExpertValidations.expertLoginValidationSchema),
    ExpertController.expertLogin
);

ExpertRouter.post("/expert-complete-profile",
    authorizeUser,
     uploadExpertFile.fields([
        { name: "signature", maxCount: 1 },
        { name: "licenseProof", maxCount: 1 },
    ]),
    // validateRequest(ExpertValidations.expertValidationSchema),
    ExpertController.expertCompleteProfile
);

ExpertRouter.patch("/update-expert-profile",
    authorizeUser,
    uploadProfile.single("expert-image"),
    // validateRequest(ExpertValidations.expertValidationSchema),
    ExpertController.expertupdateProfile
);

ExpertRouter.get("/expert-get-profile",
    authorizeUser,
    ExpertController.getExpertprofile
);

//website

ExpertRouter.post("/create-new-session",
    authorizeUser,
    ExpertController.createNewSession
);

ExpertRouter.patch("/edit-session/:id",
    authorizeUser,
    ExpertController.editSession
);

ExpertRouter.delete("/delete-session-web/:id",
    authorizeUser,
    ExpertController.deleteSessionWeb
);

ExpertRouter.get("/get-my-session",
    authorizeUser,
    ExpertController.getMySession
);

ExpertRouter.get("/get-today-session",
    authorizeUser,
    ExpertController.getTodaySession
);

ExpertRouter.get("/get-session-stat-data",
    authorizeUser,
    ExpertController.getExpertSessionStatData
);

//app

ExpertRouter.get("/get-all-session-app",
    // authorizeUser,
    ExpertController.getAllSessionApp
);

//dashboard
//session
ExpertRouter.get("/get-all-session",
    // authorizeUser,
    ExpertController.getAllSession
);

ExpertRouter.get("/get-session-request",
    // authorizeUser,
    ExpertController.getAllSessionRequest
);

ExpertRouter.post("/approve-session/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ExpertController.approveSession
);

ExpertRouter.delete("/delete-session/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ExpertController.deleteSession
);

//dashboard
//expert

ExpertRouter.get("/get-expert-request",
    // authorizeUser,
    ExpertController.getAllExpertRequest
);

ExpertRouter.get("/get-all-expert",
    // authorizeUser,
    ExpertController.getAllApprovedExpert
);

ExpertRouter.get("/get-single-expert/:id",
    // authorizeUser,
    ExpertController.getSingleExpert
);

ExpertRouter.delete("/delete-expert/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ExpertController.deleteExpert
);

ExpertRouter.post("/approve-expert/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ExpertController.approveExpert
);

ExpertRouter.post("/block-expert/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ExpertController.blockExpert
);



//pre asked question
ExpertRouter.post("/add-new-question",
    authorizeUser,
    ExpertController.addPreAskedQuestion
);

ExpertRouter.get("/get-all-session-question",
    authorizeUser,
    ExpertController.getAllUpComingOngoingSession
);

ExpertRouter.get("/get-all-question/:id",
    // authorizeUser,
    ExpertController.getAllPreAskedQuestion
);

ExpertRouter.post("/mark-question/:id",
    // authorizeUser,
    ExpertController.markQuestionAsAnswered
);

export default ExpertRouter;
// export AgoraRouter;