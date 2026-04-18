import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ReportValidations from "./Report.validation";
import ReportController from "./Report.controller";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";
import { uploadProfile } from "../../middlewares/multerMiddleware";


const ReportRouter = express.Router();

ReportRouter.post("/new-report",
    authorizeUser,
    uploadProfile.single("report-image"),
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
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ReportController.resolveReport
);

ReportRouter.delete("/delete-report/:id",
     auth([ENUM_ADMIN_ROLE.SUPER_ADMIN,ENUM_ADMIN_ROLE.ADMIN]),
    ReportController.deleteReport
);



export default ReportRouter;