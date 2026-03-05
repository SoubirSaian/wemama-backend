import { AuthRequest } from "../../../interface/authRequest";
import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import NotificationServices from "./Notification.service";

const getAllNotification = catchAsync(async (req, res) => {
     const { user } = req as AuthRequest;

     const result = await NotificationServices.getAllNotificationService(user);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all notification.",
        data: result,
    });
});

const deleteNotification = catchAsync(async (req, res) => {

     const result = await NotificationServices.deleteNotification(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Notification deleted.",
        data: result,
    });
});

const getAllAdminNotification = catchAsync(async (req, res) => {

     const result = await NotificationServices.getAllAdminNotificationService();
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Retrieved all notification.",
        data: result,
    });
});

const deleteAdminNotification = catchAsync(async (req, res) => {

     const result = await NotificationServices.deleteAdminNotification(req.params.id);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Deleted notification.",
        data: result,
    });
});

const NotificationController = { 
    getAllNotification,
    deleteNotification,
    getAllAdminNotification,
    deleteAdminNotification
 };
export default NotificationController;