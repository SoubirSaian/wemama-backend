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

//dashboard

ReportRouter.get("/get-all-report",

    ReportController.getAllReport
);

ReportRouter.get("/get-report-detail/:id",
    
    ReportController.getReportDetail
);

ReportRouter.post("/resolve-report/:id",
    
    ReportController.resolveReport
);

ReportRouter.delete("/delete-report/:id",
    
    ReportController.deleteReport
);



export default ReportRouter;