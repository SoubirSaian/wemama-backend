import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {auth, authorizeUser} from "../../middlewares/auth";
import { adminLoginValidation, changeAdminPasswordValidation, createAdminvalidation, editProfilevalidation } from "./Dashboard.validation";
import DashboardController from "./Dashboard.controller";
import AuthValidations from "../auth/auth.validation";
import { uploadProfile } from "../../middlewares/multerMiddleware";
import { ENUM_ADMIN_ROLE } from "../../../utilities/enum";



const dashboardRouter = express.Router();

dashboardRouter.post("/create-admin",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    validateRequest(createAdminvalidation),
    DashboardController.adminRegister
);

dashboardRouter.post("/login-admin",
    // auth(["Super_Admin"]),
    validateRequest(adminLoginValidation),
    DashboardController.adminLogin
);

dashboardRouter.post("/admin-verify-code",
    validateRequest(AuthValidations.verifyCodeValidation)  ,
    DashboardController.adminVerifyCode
);

dashboardRouter.post("/admin-send-verify-code",
    validateRequest(AuthValidations.sendVerifyCodeValidation)  ,
    DashboardController.adminSendVerifyCode
);

dashboardRouter.patch("/admin-reset-password",
    authorizeUser,
    validateRequest(AuthValidations.resetPasswordValidation)  ,
    DashboardController.adminResetPassword
);

dashboardRouter.patch("/edit-admin-profile",
    // auth(["Super_Admin"]),
    authorizeUser,
    uploadProfile.single('admin-image'),
    validateRequest(editProfilevalidation),
    DashboardController.editAdminProfile
);

dashboardRouter.patch("/admin-change-password",
    // auth(["Super_Admin"]),
    authorizeUser,
    validateRequest(changeAdminPasswordValidation),
    DashboardController.changeAdminPassword
);

dashboardRouter.delete("/delete-admin",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]),
    // validateRequest(adminLoginValidation),
    DashboardController.deleteAdminAccount
);

dashboardRouter.post("/block-admin/:id",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]), //only super admin can block a admin
    // validateRequest(adminLoginValidation),
    DashboardController.blockAdmin
);

dashboardRouter.get("/get-all-admin",
    auth([ENUM_ADMIN_ROLE.SUPER_ADMIN]), //only super admin can get al admin
    // validateRequest(adminLoginValidation),
    DashboardController.getAllAdmin
);

dashboardRouter.get("/get-admin-detail",
    // auth(["Super_Admin"]), only super admin can block a admin
    authorizeUser,
    // validateRequest(adminLoginValidation),
    DashboardController.getAdminDetail
);




export default dashboardRouter;