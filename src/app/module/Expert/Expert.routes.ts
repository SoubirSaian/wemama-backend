import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ExpertValidations from "./Expert.validation";
import ExpertController from "./Expert.controller";
import { uploadExpertFile, uploadProfile } from "../../middlewares/multerMiddleware";


const ExpertRouter = express.Router();

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
    validateRequest(ExpertValidations.expertValidationSchema),
    ExpertController.expertCompleteProfile
);

ExpertRouter.post("/update-expert-profile",
    authorizeUser,
    uploadProfile.single("expert-image"),
    // validateRequest(ExpertValidations.expertValidationSchema),
    ExpertController.expertupdateProfile
);

ExpertRouter.get("/get-expert-profile",
    authorizeUser,
    ExpertController.getExpertprofile
);

//website

ExpertRouter.post("/create-new-session",
    authorizeUser,
    ExpertController.createNewSession
);

ExpertRouter.get("/get-my-session",
    authorizeUser,
    ExpertController.getMySession
);

ExpertRouter.get("/get-today-session",
    authorizeUser,
    ExpertController.getTodaySession
);

//dashboard
//session
ExpertRouter.get("/get-all-session",
    // authorizeUser,
    ExpertController.getAllSession
);

ExpertRouter.get("/all-session-request",
    // authorizeUser,
    ExpertController.getAllSessionRequest
);

ExpertRouter.post("/approve-session/:id",
    // authorizeUser,
    ExpertController.approveSession
);

ExpertRouter.delete("/delete-session/:id",
    // authorizeUser,
    ExpertController.deleteSession
);

//dashboard
//expert

ExpertRouter.get("/get-expert-request",
    // authorizeUser,
    ExpertController.getAllExpertRequest
);

ExpertRouter.get("/all-approved-espert",
    // authorizeUser,
    ExpertController.getAllApprovedExpert
);

ExpertRouter.get("/get-single-expert/:id",
    // authorizeUser,
    ExpertController.getSingleExpert
);

ExpertRouter.get("/delete-expert/:id",
    // authorizeUser,
    ExpertController.deleteExpert
);

ExpertRouter.get("/approve-expert/:id",
    // authorizeUser,
    ExpertController.approveExpert
);
ExpertRouter.get("/block-expert/:id",
    // authorizeUser,
    ExpertController.blockExpert
);



export default ExpertRouter;