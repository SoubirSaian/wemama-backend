import express from "express";
import {auth} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import MoodValidations from "./Mood.validation";
import MoodController from "./Mood.controller";


const MoodRouter = express.Router();

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

//dashboard

MoodRouter.post("/add-new-mood",
    // auth(["Supplier","Customer"]),
    validateRequest(MoodValidations.addMoodContent),
    MoodController.addMoodContent
);



export default MoodRouter;