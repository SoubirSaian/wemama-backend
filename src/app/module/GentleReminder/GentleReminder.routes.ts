import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import GentleReminderValidations from "./GentleReminder.validation";
import GentleReminderController from "./GentleReminder.controller";


const GentleReminderRouter = express.Router();



export default GentleReminderRouter;