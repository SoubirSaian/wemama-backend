import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ReportValidations from "./Report.validation";
import ReportController from "./Report.controller";


const ReportRouter = express.Router();

ReportRouter.post("/new-report",
    authorizeUser,
    validateRequest(ReportValidations.reportValidationSchema),
    ReportController.reportContent
);



export default ReportRouter;