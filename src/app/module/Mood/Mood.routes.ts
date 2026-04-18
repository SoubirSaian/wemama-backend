import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import MoodValidations from "./Mood.validation";
import MoodController from "./Mood.controller";
import { uploadProfile } from "../../middlewares/multerMiddleware";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";


const MoodRouter = express.Router();

MoodRouter.post("/create-mood-chip",
    // auth(["Supplier","Customer"]),
    uploadProfile.single("mood-image"),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.createMoodChip
);

MoodRouter.get("/get-all-mood",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.getAllMood
);

MoodRouter.get("/get-all-mood-content",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.getALLMoodContent
);

//maintain check in mood
MoodRouter.post("/add-today-mood",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.maintainCheckinStreak
);

//dashboard

MoodRouter.post("/add-mood-content",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(MoodValidations.addMoodContent),
    MoodController.addMoodContent
);

MoodRouter.get("/get-mood-content-dashboard",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.getMoodContentDashboard
);

MoodRouter.post("/add-mood-image",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    uploadProfile.single("mood-image"),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.addMoodImage
);

MoodRouter.patch("/edit-mood-content/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    validateRequest(MoodValidations.editMoodContent),
    MoodController.editMoodContent
);

MoodRouter.delete("/delete-mood-content/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.deleteMoodContent
);

//Streak 

MoodRouter.post("/add-streak-msg",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.addStreakMsg
);

MoodRouter.patch("/edit-streak-msg",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.editStreakMsg
);

MoodRouter.delete("/delete-streak-msg/:id",
    // auth(["Supplier","Customer"]),
    // validateRequest(MoodValidations.addMoodContent),
    MoodController.deleteStreakMsg
);





export default MoodRouter;