import express from "express";
import {auth, authorizeUser} from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import NotificationValidations from "./Notification.validation";
import NotificationController from "./Notification.controller";


const notificationRouter = express.Router();


notificationRouter.get("/get-all-notification",
    authorizeUser,
    NotificationController.getAllNotification
);
notificationRouter.delete("/delete-notification/:id",

    NotificationController.deleteNotification
);

//dashboard

notificationRouter.get("/get-admin-notification",
    // authorizeUser,
    NotificationController.getAllAdminNotification
);

notificationRouter.get("/delete-admin-notification/:id",
    // authorizeUser,
    NotificationController.deleteAdminNotification
);


export default notificationRouter;